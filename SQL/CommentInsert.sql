USE [Kommu]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Insert]    Script Date: 6/7/2022 9:56:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Cody Snyder
-- Create date: 05/21/22
-- Description: Insert comment
-- Code Reviewer: Bryant Morales

-- MODIFIED BY: 
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

ALTER  proc [dbo].[Comments_Insert]
				@Subject nvarchar(50)
				,@Text nvarchar(3000)
				,@ParentId int
				,@EntityTypeId int
				,@EntityId int
				,@CreatedBy int
				,@Id int OUTPUT

AS

/*
	DECLARE @Id int = 0

	Declare @Subject nvarchar(50) = ''
			,@Text nvarchar(3000) = 'This was a great house that I was able to swap for, very clean and loved the aesthetics'
			,@ParentId int = 1
			,@EntityTypeId int = 1
			,@EntityId int = 11
			,@CreatedBy int = 24
			
	EXECUTE [dbo].[Comments_Insert]
				@Subject
				,@Text
				,@ParentId
				,@EntityTypeId
				,@EntityId
				,@CreatedBy
				,@Id OUTPUT


*/

BEGIN

	INSERT INTO [dbo].[Comments]
           ([Subject]
           ,[Text]
           ,[ParentId]
           ,[EntityTypeId]
           ,[EntityId]
           ,[CreatedBy])
     VALUES
           (@Subject
           ,@Text
           ,@ParentId
           ,@EntityTypeId
           ,@EntityId
           ,@CreatedBy)

	Set @Id = SCOPE_IDENTITY();


END