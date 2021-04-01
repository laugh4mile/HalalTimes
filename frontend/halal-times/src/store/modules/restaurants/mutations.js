export default {
    setRestaurants(state, payload) {
        state.restaurants = payload;
    },
    setKeyword(state, payload) {
        state.keyword = payload;
    },
    setReviews(state, payload) {
        state.reviews = payload;
    },
};