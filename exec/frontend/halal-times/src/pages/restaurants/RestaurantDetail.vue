<template>
  <div
    id="bg"
    class="G-market-sans font-color-black-400 w-2/3 mx-auto px-10 py-6"
  >
    <div id="TOP"></div>
    <a href="#TOP" id="top-button" class="fixed bottom-8 right-8"
      ><img src="@/assets/icon/arrow-top.png" alt="top"
    /></a>
    <base-title-small>Halal Times</base-title-small>
    <div id="top-restaurant-title" class="flex flex-col text-center ">
      <section class="w-full border-line">
        <span class="G-market-sans-B text-3xl tracking-widest">{{
          restaurant.restaurantName
        }}</span>
      </section>
      <span class="text-lg font-color-black-200 my-2">{{
        restaurant.address
      }}</span>
    </div>
    <div id="center-contents" class="flex">
      <section id="left-contents" class="w-7/12">
        <img
          :src="imgsrc"
          alt="restaurant photo"
          class="object-cover w-full h-96 border-line-full"
        />
        <article class="flex flex-col my-8">
          <span class="font-bold text-2xl tracking-wider text-center mt-8 mb-6"
            >사용자 리뷰</span
          >
          <div v-if="isLoading" class="my-32">
            <base-spinner></base-spinner>
          </div>
          <div v-else-if="reviews.length > 0">
            <review-card
              v-for="reviewItem in reviews"
              :key="reviewItem.id_review"
              :id_review="reviewItem.id_review"
              :id_user="reviewItem.id_user"
              :nickname="reviewItem.nickname"
              :id_store="reviewItem.id_store"
              :store_name="reviewItem.store_name"
              :score="reviewItem.score"
              :content="reviewItem.content"
              :upload_date="reviewItem.upload_date"
              :likeCnt="reviewItem.likeCnt"
              :likeCheck="reviewItem.likeCheck"
              :thumbnail="reviewItem.thumbnail"
            ></review-card>
          </div>
          <span
            v-else
            class="text-xl text-center my-32 font-S-CoreDream-medium font-bold font-color-black-200"
            >등록된 리뷰가 없습니다. 첫 번째로 리뷰를 남겨보세요!</span
          >
        </article>
      </section>
      <section class="flex flex-col w-5/12 h-auto mx-2">
        <kakao-map :lat="+restaurant.lat" :lng="+restaurant.lng"></kakao-map>
        <!-- <naver-map :lat="+restaurant.lat" :lng="+restaurant.lng"></naver-map> -->
        <!-- <img
          src="@/assets/resources/default.png"
          alt="map"
          class="object-cover w-full h-64 border-line-full"
        /> -->
        <span class="font-bold text-lg border-line mt-1 pl-1">위치</span>
        <div class="flex border-line text-sm my-2 px-2 pb-2">
          <article
            class="cursor-pointer transition duration-100 ease-in-out transform hover:scale-105"
            @click="bookmark"
          >
            <img
              v-if="!isBookmark"
              src="@/assets/icon/heart.png"
              alt="bookmark icon"
              class="object-contain w-8 h-8"
            />
            <img
              v-else
              src="@/assets/icon/heart_filled.png"
              alt="bookmark icon"
              class="object-contain w-8 h-8"
            />
          </article>
          <article class="flex ml-auto justify-self-end text-sm">
            <base-button mode="secondary" @click="writeReview"
              >리뷰 작성</base-button
            >
            <base-dialog
              :open="reviewDialogIsVisible"
              @close="closeReviewDialog"
              custom="width-wide"
              class="flex flex-col justify-items-center z-40"
            >
              <span
                class="flex justify-self-end ml-auto cursor-pointer text-2xl mr-2"
                @click="closeReviewDialog"
                >X</span
              >
              <span class="text-2xl font-bold mt-2 mb-4 icon-close"
                >리뷰 작성하기</span
              >
              <section class="flex flex-col space-y-4 w-full justify-center">
                <div class="star-rating space-x-4 mx-auto">
                  {{ ratingEmoji }}
                  <input
                    type="radio"
                    id="5-stars"
                    name="rating"
                    value="5"
                    v-model="ratings"
                  />
                  <label for="5-stars" class="star pr-4">★</label>
                  <input
                    type="radio"
                    id="4-stars"
                    name="rating"
                    value="4"
                    v-model="ratings"
                  />
                  <label for="4-stars" class="star">★</label>
                  <input
                    type="radio"
                    id="3-stars"
                    name="rating"
                    value="3"
                    v-model="ratings"
                  />
                  <label for="3-stars" class="star">★</label>
                  <input
                    type="radio"
                    id="2-stars"
                    name="rating"
                    value="2"
                    v-model="ratings"
                  />
                  <label for="2-stars" class="star">★</label>
                  <input
                    type="radio"
                    id="1-star"
                    name="rating"
                    value="1"
                    v-model="ratings"
                  />
                  <label for="1-star" class="star">★</label>
                </div>
                <textarea
                  class="input-base"
                  rows="8"
                  placeholder="리뷰를 작성하세요"
                  v-model.trim="reviewContents"
                />
                <!-- <input type="file" accept=".png, .jpg, .jpeg, .gif" @change="uploadImage" /> -->
              </section>
              <!-- <input
                multiple="multiple"
                ref="file"
                type="file"
                id="file"
                name="file"
                @change="onChangeImages"
                class="my-4"
              /> -->
              <section class="flex space-x-2 mt-6 mb-4">
                <base-button
                  type="submit"
                  @click="completeUpload"
                  mode="primary"
                  class="text-base"
                >
                  등록하기</base-button
                >
              </section>
            </base-dialog>
          </article>
        </div>
        <article class="flex flex-col mx-10 space-y-4 mb-6">
          <span class="font-bold text-2xl tracking-wider text-center my-2"
            >음식점 정보</span
          >
          <div class="flex items-center">
            <span class="font-bold w-16 mr-4 text-right">태그</span>
            <article class="flex flex-col space-y-2">
              <span
                v-if="restaurant.foodCategory"
                class="w-max bg-brown inline-block rounded-full px-3 py-1 text-sm text-white"
                >{{ restaurant.foodCategory }}</span
              >
              <span
                v-if="restaurant.muslimFriendly"
                class="w-max inline-block rounded-full px-3 py-1 text-sm text-white"
                :class="getTagColor"
                >{{ restaurant.muslimFriendly }}</span
              >
            </article>
          </div>
          <div class="flex items-center">
            <span class="font-bold w-16 mr-4 text-right">평점</span>
            <div v-if="averageScore > 0" class="star-ratings">
              <div
                class="star-ratings-fill space-x-2 text-lg"
                :style="{ width: ratingToPercent + '%' }"
              >
                <span>★</span><span>★</span><span>★</span><span>★</span
                ><span>★</span>
              </div>
              <div class="star-ratings-base space-x-2 text-lg">
                <span>★</span><span>★</span><span>★</span><span>★</span
                ><span>★</span>
              </div>
            </div>
            <span v-if="averageScore > 0" class="text-sm ml-4"
              >({{ averageScore }})</span
            >
            <span v-else class="font-color-black-200 text-xs"
              >아직 등록된 리뷰가 없어요!</span
            >
          </div>
          <div class="flex items-center">
            <span class="font-bold w-16 mr-4 text-right">전화번호</span>
            <span class="text-sm">
              {{ restaurant.tel }}
            </span>
          </div>
          <div class="flex items-center">
            <span class="font-bold w-16 mr-4 text-right">주차</span>
            <span class="text-sm">
              {{ restaurant.parking }}
            </span>
          </div>
          <div class="flex items-center">
            <span class="font-bold w-16 mr-4 text-right">영업시간</span>
            <span class="text-sm">
              {{ restaurant.working_time }}
            </span>
          </div>
        </article>
        <article class="flex mx-auto">
          <base-button id="btn" @click="goPreviousPage">돌아가기</base-button>
        </article>
      </section>
    </div>
  </div>
</template>
<script>
import ReviewCard from '../../components/restaurants/ReviewCard.vue';
import KakaoMap from '../../components/ui/KakaoMap.vue';
// import NaverMap from '../../components/ui/NaverMap.vue';
import axios from 'axios';
const SERVER_URL = process.env.VUE_APP_SERVER_URL;

export default {
  components: {
    ReviewCard,
    // NaverMap
    KakaoMap
  },
  // props: ['restaurantId', 'restaurantName'],
  data() {
    return {
      isLoading: false,
      reviewDialogIsVisible: false,
      restaurant: null,
      tagColor: 1,
      score: 0,
      reviewContents: '',
      ratings: 0,
      imageUrl: [],
      myfile: []
    };
  },
  computed: {
    averageScore() {
      const newValue = this.$store.getters['restaurants/averageScore'];

      return newValue;
    },
    isBookmark() {
      const newValue = this.$store.getters['restaurants/bookmarked'];
      // if (this.bookmarked !== newValue) this.bookmarked = newValue;
      return newValue;
    },
    getTagColor() {
      if (this.tagColor === 1) return 'tag-color-1';
      else if (this.tagColor === 2) return 'tag-color-2';
      else if (this.tagColor === 3) return 'tag-color-3';
      else return 'tag-color-4';
    },
    ratingToPercent() {
      //   const score = +this.score * 0.2;
      const score = +this.$store.getters['restaurants/averageScore'] * 20;
      return score + 6;
    },
    imgsrc() {
      return this.restaurant.imgpath;
      // return 'https://i.stack.imgur.com/y9DpT.jpg';
    },
    reviews() {
      return this.$store.getters['restaurants/reviews'];
    },
    ratingEmoji() {
      if (this.ratings === '5') return '😍';
      else if (this.ratings === '4') return '😎';
      else if (this.ratings === '3') return '😄';
      else if (this.ratings === '2') return '😒';
      else if (this.ratings === '1') return '😠';
      else return '';
    }
  },
  created() {
    // console.log(this.$store.getters['restaurants/restaurantName'], '상세 정보');
    const restaurantId = this.$store.getters['restaurants/restaurantId'];
    // console.log("created: restaurantId", restaurantId);
    this.restaurant = this.$store.getters['restaurants/restaurants'].find(
      restaurant => restaurant.restaurantId === restaurantId
    );
    // console.log("created: this.restaurant", this.restaurant);
    this.loadLikeReviews();
    console.log('created: reviews', this.$store.getters['restaurants/reviews']);
    // this.bookmarked = this.$store.getters['restaurants/bookmarked'];

    switch (this.muslimFriendly) {
      case '무슬림 자가 인증':
        this.tagColor = 2;
        break;
      case '무슬림 프렌들리':
        this.tagColor = 3;
        break;
      case '포크프리':
        this.tagColor = 4;
        break;
    }
  },
  methods: {
    goPreviousPage() {
      this.$router.go(-1);
    },
    updateAverageScore() {
      this.$store.dispatch('restaurants/refreshAverageScore');
    },
    async loadLikeReviews() {
      this.isLoading = true;
      try {
        await this.$store.dispatch('restaurants/loadLikeReviews');
      } catch (error) {
        this.error =
          error.message || '북마크와 리뷰를 불러오는 중 문제가 발생했습니다.';
      }
      this.updateAverageScore();

      this.isLoading = false;
      // this.restaurant.lat = (+this.restaurant.lat).toFixed(4);
      // this.restaurant.lng = (+this.restaurant.lng).toFixed(4);
      // console.log(this.restaurant.lat, this.restaurant.lng);
    },
    onChangeImages(e) {
      var file = e.target.files;
      for (var i = 0; i < file.length; i++) {
        console.log(file[i]);

        this.imageUrl.push(URL.createObjectURL(file[i]));
        this.myfile.push(this.$refs.file.files[i]);
      }
      console.log('imageUrl : ', this.imageUrl);
      console.log('myfile : ', this.myfile);
    },
    completeUpload() {
      const restaurantId = this.$store.getters['restaurants/restaurantId'];
      console.log('restaurantId : ', restaurantId);
      var frm = new FormData();
      for (var i = 0; i < this.myfile.length; i++) {
        let file = this.myfile[i];
        frm.append('files', file);
      }
      frm.append('id_store', restaurantId);
      frm.append('email', this.$store.getters.getUserEmail);
      frm.append('content', this.reviewContents);
      frm.append('score', +this.ratings);
      console.log('frm : ', frm);
      console.log('frm : ', frm.score);
      axios
        .post(`${SERVER_URL}/review`, frm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          const result = response.data;
          if (result === 'success')
            this.$toast.success(
              `<span class="G-market-sans-L font-bold text-sm tracking-wide">🌞 리뷰 등록에 성공하였습니다.</span>`
            );
          else
            this.$toast.error(
              `<span class="G-market-sans-L font-bold text-sm tracking-wide">❌ 리뷰 등록에 실패하였습니다.</span>`
            );
          this.myfile.splice(0, this.myfile.length);
          this.imageUrl.splice(0, this.imageUrl.length);
          this.updateAverageScore();
          this.loadLikeReviews();
          this.closeReviewDialog();
        });
    },
    async registerReview() {
      // content, id_user, id_store, score
      let result;
      try {
        result = await this.$store.dispatch('restaurants/registerReview', {
          content: this.reviewContents,
          score: +this.ratings,
          files: this.myfile
        });
      } catch (error) {
        this.error = error.message || '리뷰를 등록하는 중 문제가 발생했습니다.';
      }
      if (result === 'success')
        this.$toast.success(
          `<span class="G-market-sans-L font-bold text-sm tracking-wide">🌞 리뷰 등록에 성공하였습니다.</span>`
        );
      else
        this.$toast.error(
          `<span class="G-market-sans-L font-bold text-sm tracking-wide">❌ 리뷰 등록에 실패하였습니다.</span>`
        );

      this.updateAverageScore();
      this.loadLikeReviews();
      this.closeReviewDialog();
    },
    async bookmark() {
      // console.log("methods: bookmark/getUserEmail", this.$store.getters.getUserEmail);
      if (this.$store.getters.getUserEmail === '') {
        alert('로그인이 필요한 기능입니다.');
        return;
      }

      try {
        await this.$store.dispatch('restaurants/toggleBookmark');
      } catch (error) {
        this.error = error.message || '북마크 중 문제가 발생했습니다.';
      }
      console.log(
        'methods: bookmark/bookmarked',
        !this.$store.getters['restaurants/bookmarked']
      );
      if (!this.$store.getters['restaurants/bookmarked'])
        this.$toast.info(
          `<span class="G-market-sans-L font-bold text-sm tracking-wide">😍 북마크한 식당으로 등록되었습니다.</span>`
        );
      else
        this.$toast.show(
          `<span class="G-market-sans-L font-bold text-sm tracking-wide">😥 북마크가 해제되었습니다.</span>`
        );
    },
    writeReview() {
      if (this.$store.getters.getUserEmail === '') {
        alert('로그인이 필요한 기능입니다.');
        return;
      }

      this.reviewDialogIsVisible = true;
    },
    closeReviewDialog() {
      this.reviewContents = '';
      this.reviewDialogIsVisible = false;
    }
  }
};
</script>
<style scoped>
#bg {
  background-color: #f4f2ea;
}

#btn {
  width: 20rem;
}

.icon-close:hover {
  color: #cf4f2e;
}
</style>
