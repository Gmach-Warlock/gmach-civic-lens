export const newIssuesStateObject = {
  meta: {
    id: "",
    authorId: "",
    authorName: "",
    createdAt: "",
    updatedAt: "",
  },
  general: {
    title: "",
    description: "",
    category: "",
  },
  location: {
    address: "",
    city: "",
    zipCode: "",
    coords: { lat: 0, lng: 0 },
  },
  status: {
    isOpen: true,
    current: "",
    urgency: "",
    lastActionDate: "",
  },
  social: {
    upvotes: 0,
    tags: [],
    comments: [],
  },
};

export const newAuthStateObject = {};
