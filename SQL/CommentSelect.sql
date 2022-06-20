ALTER proc [dbo].[Comments_Select_ByEntityId]
					@EntityTypeId int
					,@EntityId int
AS

/*
	DECLARE @EntityTypeId int = 1
			,@EntityId int = 11

	EXECUTE [dbo].[Comments_Select_ByEntityId]
					@EntityTypeId
					,@EntityId

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
		,up.[FirstName]
		,up.[LastName]
		,up.[AvatarUrl]
		,Replies = 
			( 
			SELECT
				ct.[Id]
				,ct.[Subject]
				,ct.[Text]
				,ct.[ParentId]
				,ct.[EntityTypeId]
				,ct.[EntityId]
				,ct.[DateCreated]
				,ct.[DateModified]
				,ct.[CreatedBy]
				,ct.[IsDeleted]
				,ups.[FirstName]
				,ups.[LastName]
				,ups.[AvatarUrl]
			FROM [dbo].Comments as ct 
			INNER JOIN [dbo].[UserProfiles] as ups
				on ct.CreatedBy = ups.UserId
										
			WHERE (	ct.ParentId = c.Id 
				AND ct.[EntityId] = c.EntityId
				AND ct.[IsDeleted] = 0)
			FOR JSON PATH
			)

	FROM [dbo].[Comments] as c INNER JOIN [dbo].EntityTypes as e
							on c.EntityTypeId = e.Id
							INNER JOIN [dbo].Users as u
							on c.CreatedBy = u.Id
							INNER JOIN [dbo].[UserProfiles] as up
							on c.CreatedBy = up.UserId
	WHERE (c.[EntityId] = @EntityId
			AND c.[EntityTypeId] = @EntityTypeId
			AND c.[ParentId] = 0
			AND c.[IsDeleted] = 0)

	ORDER BY c.[Id]

END
