ALTER  proc [dbo].[Comments_Select_ByCreatedBy]
				@CreatedBy int

AS

/*
	DECLARE @Id int = 2

	EXECUTE [dbo].[Comments_Select_ByCreatedBy]
				@Id

*/

BEGIN

	SELECT c.[Id]
		,c.[Subject]
		,c.[Text]
		,c.[ParentId]
		,c.[EntityTypeId]
		,c.[EntityId]
		,c.[DateCreated]
		,c.[DateModified]
		,c.[CreatedBy]
		,c.[IsDeleted]
		,Replies = ( Select *
					FROM [dbo].Comments
					WHERE (ParentId = c.Id 
					AND EntityId = c.EntityId)
					FOR JSON AUTO)

	FROM [dbo].[Comments] as c INNER JOIN [dbo].[Users] as u
						on c.[CreatedBy] = u.[Id]
	WHERE (c.[CreatedBy] = @CreatedBy
			AND c.[ParentId] = 0
			AND c.[IsDeleted] = 0)

	ORDER BY c.[Id]

END
