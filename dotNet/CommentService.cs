using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain.Comments;
using Sabio.Models.Requests.Comments;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services.Comments
{
    public class CommentService : ICommentService
    {
        IDataProvider _data = null;

        public CommentService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(CommentAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Comments_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col, userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;
                int.TryParse(oId.ToString(), out id);

            });

            return id;
        }

        public List<Comment> GetCommentByEntity(int entityId, int entityTypeId)
        {
            string procName = "[dbo].[Comments_Select_ByEntityId]";
            List<Comment> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@EntityTypeId", entityTypeId);
                paramCol.AddWithValue("@EntityId", entityId);
            }, delegate (IDataReader reader, short set)
            {
                Comment comment = MapSingleComment(reader);

                if (list == null)
                {
                    list = new List<Comment>();
                }
                list.Add(comment);

            });
            return list;
        }

        public List<Comment> GetCommentByCreatedBy(int createdBy)
        {
            string procName = "[dbo].[Comments_Select_ByCreatedBy]";
            List<Comment> list = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {
                paramCol.AddWithValue("@CreatedBy", createdBy);
            }, delegate (IDataReader reader, short set)
            {
                Comment comment = MapSingleComment(reader);

                if (list == null)
                {
                    list = new List<Comment>();
                }
                list.Add(comment);
                
            });
            return list;
        }

        public void Update(CommentUpdateRequest model)
        {
            
            string procName = "[dbo].[Comments_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("Subject", model.Subject);
                col.AddWithValue("Text", model.Text);

            }, returnParameters: null);
        }

        public void UpdateIsDeleted(IsDeletedUpdateRequest model)
        {

            string procName = "[dbo].[Comments_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@IsDeleted", model.IsDeleted);

            }, returnParameters: null);
        }

        private static void AddCommonParams(CommentAddRequest model, SqlParameterCollection col, int userId)
        {
            int parentId = model.ParentId;
            col.AddWithValue("Subject", model.Subject);
            col.AddWithValue("Text", model.Text);
            col.AddWithValue("ParentId", model.ParentId);
            col.AddWithValue("EntityTypeId", model.EntityTypeId);
            col.AddWithValue("EntityId", model.EntityId);
            col.AddWithValue("CreatedBy", userId);
        }

        private static Comment MapSingleComment(IDataReader reader)
        {
            Comment comment = new Comment();
            int startIndex = 0;

            comment.Id = reader.GetSafeInt32(startIndex++);
            comment.Subject = reader.GetSafeString(startIndex++);
            comment.Text = reader.GetSafeString(startIndex++);
            comment.ParentId = reader.GetSafeInt32(startIndex++);
            comment.EntityTypeId = reader.GetSafeInt32(startIndex++);
            comment.EntityId = reader.GetSafeInt32(startIndex++);
            comment.DateCreated = reader.GetSafeDateTime(startIndex++);
            comment.DateModified = reader.GetSafeDateTime(startIndex++);
            comment.CreatedBy = reader.GetSafeInt32(startIndex++);
            comment.IsDeleted = reader.GetSafeBool(startIndex++);
            comment.Replies = reader.DeserializeObject<List<Comment>>(startIndex++);

            return comment;
        }
    }
}
