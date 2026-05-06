const formatIssuesResponse = (issues) => {
    return {
        issues: issues.map(issue => {
            return {
                meta: {
                    id: issue.id,
                    authorId: issue.authorId,
                    createdAt: issue.createdAt,
                    updatedAt: issue.updatedAt

                },
                general: {
                    title: issue.title,
                    description: issue.description,
                    category: issue.category,
                },
                location: {
                    address: issue.address,
                    city: issue.city,
                    zipCode: issue.zipCode,
                    coords: {
                        lat: issue.lat,
                        lng: issue.lng
                    } 
                },
                status: {
                    isOpen: issue.isOpen,
                    current: issue.current,
                    urgency: issue.urgency,
                    lastActionDate: issue.lastActionDate
                },
                social: {
                    upvotes: issue.upvotes,
                    comments: issue.comments,
                    tags: issue.tags
                }

            }
        })
    }
}