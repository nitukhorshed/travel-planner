const API_BASE_URL = "http://travel-planner-3ro5.onrender.com/api";

const api = {
  getFeaturedPackages: async () => {
    const res = await fetch(`${API_BASE_URL}/packages/featured`);
    return res.json();
  },

  getTrendingPackages: async () => {
    const res = await fetch(`${API_BASE_URL}/packages/trending`);
    return res.json();
  },

  getFeaturedPlanners: async () => {
    const res = await fetch(`${API_BASE_URL}/planner-profile/featured`);
    return res.json();
  },
};