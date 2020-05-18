<template>
  <div class="dock">
    <v-col class="pa-0" sm="6" lg="3" offset-sm="6">
      <v-snackbar style="bottom:113px;" v-model="copiedSnackbar" :timeout="2000">
        Copied to clipboard!
      </v-snackbar>
      <v-card class="dock-header">
        <!-- v-ripple @click="toggleExpand"  -->
        <div class="place-label-container">
          <v-row align="center" justify="space-between" no-gutters>
            <!-- 📝'no-gutters' remove🔪gutter between v-cols. -->
            <v-col>
              <p class="headline mb-2">{{ place.properties.name }}</p>
              <v-row no-gutters>
                <chip-label
                  :value="place.properties.type"
                  :theme="getThemeOf(place.properties.type)"
                  style="margin: 0px 4px 4px 0px;"
                ></chip-label>
                <v-chip
                  v-if="place.properties.type == 'department'"
                  color="teal"
                  text-color="white"
                >
                  {{ place.properties.buildingsString }}
                </v-chip>
              </v-row>
            </v-col>
            <!-- <v-spacer></v-spacer> -->

            <v-chip
              @touchstart.stop
              @mousedown.stop
              @click.stop="openShareMenu()"
              outlined
              large
              color="black"
            >
              <v-avatar left>
                <v-icon>mdi-share-variant</v-icon>
              </v-avatar>
              Share
            </v-chip>
          </v-row>
        </div>

        <div v-if="expanded">
          <v-list-item>
            <v-list-item-title>{{ note }}</v-list-item-title>
          </v-list-item>
        </div>
      </v-card>
    </v-col>
    <v-bottom-sheet max-width="1000px" v-model="shareMenu">
      <!-- setup for copying text -->
      <textarea
        v-show="false"
        name="copyarea"
        id="copyarea"
        cols="30"
        rows="1"
        autofocus
      ></textarea>
      <v-list>
        <v-subheader>Share Place</v-subheader>
        <v-list-item
          v-for="{ name, icon, onClick } in shareMenuItems"
          :key="name"
          @click="onClick()"
        >
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <v-icon>{{ icon }}</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script lang="ts">
/* eslint-disable no-console */
import eventBus from '@/eventBus';
import store from '@/store';
import { Route } from 'vue-router';
import Vue from 'vue';
import Component from 'vue-class-component';
import { Place } from '@/models/place';
import { Watch } from 'vue-property-decorator';
import ChipLabel from './ChipLabel.vue';
import place_types from '@/constants/placeType';
import kPlaceToTheme from '@/constants/placeToTheme';

@Component<Dock>({
  components: { ChipLabel },
})
export default class Dock extends Vue {
  place: Place = (this.$attrs.place as unknown) as Place;
  expanded: Boolean = false;
  shareMenu = false;
  copiedSnackbar = false;
  shareMenuItems = [
    {
      name: 'Facebook',
      icon: 'mdi-facebook',
      onClick: () =>
        this.sharePlace(
          `https://www.facebook.com/dialog/share?app_id=${this.facebookAppId}&display=popup&href=${this.currentLink}&redirect_uri=${this.currentLink}`,
        ),
    },
    {
      name: 'Copy to Clipboard',
      icon: 'mdi-clipboard-multiple-outline',
      onClick: () => this.copyToClipboard(this.currentLink),
    },
    // {
    //   name: 'S.M.S',
    //   icon: 'mdi-android-messages',
    //   onClick: () => (window.location.href = `sms:;body=${this.currentLink}`),
    // },
    // {
    //   name: 'Messenger',
    //   icon: 'mdi-facebook-messenger',
    //   onClick: () => {
    //     let link = `http://www.facebook.com/dialog/send?app_id=${this.facebookAppId}&link=${this.currentLink}&redirect_uri=${this.currentLink}`;
    //     this.sharePlace(link);
    //   },
    // },
    // {
    //   name: 'Tweet',
    //   icon: 'mdi-twitter',
    //   onClick: () => {
    //     let link = 'https://twitter.com/intent/tweet';
    //     this.sharePlace(link);
    //   },
    // },
  ];

  get lngLat() {
    return this.place.geometry.coordinates;
  }

  get phones() {
    return this.place.properties.phones;
  }

  get note() {
    return this.place.properties.note;
  }

  get currentLink() {
    return `https://du-map.web.app/place/${this.place.properties.id}`;
  }

  get facebookAppId() {
    return 2954507561282991;
  }

  getThemeOf(value: place_types) {
    return kPlaceToTheme[value];
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  copyToClipboard(text: string) {
    let copyArea = document.getElementById('copyarea') as any;
    copyArea.value = text;
    copyArea.focus();
    copyArea.style.display = 'inline-block';
    copyArea.select();
    copyArea.blur();

    let copySucceed = document.execCommand('copy');
    copyArea.style.display = 'none';

    if (copySucceed) {
      this.closeShareMenu();
      this.fireCopiedSnackBar();
    }
  }

  openShareMenu() {
    console.log(window.location.href);
    let nav = navigator as any;
    if (nav.share) {
      console.log('share menu available');
      (nav as any).share({
        title: 'Share ' + this.place.properties.name,
        url: window.location.href,
      });
    } else {
      console.log('share menu NOT available');
      this.shareMenu = true;
    }
  }

  closeShareMenu() {
    this.shareMenu = false;
  }

  fireCopiedSnackBar() {
    this.copiedSnackbar = true;
  }

  sharePlace(link: string) {
    window.open(link, 'newWin', 'width=500,height=500');
  }

  mounted() {
    // dispatch after mounted. need to wait for the mapbox to complete loading.
    store.dispatch('highLightPlace', store.getters.placeById(this.place.properties.id));
    // console.log(this.place);
  }

  destroyed() {
    store.dispatch('removeHighLight');
  }

  // @Watch('$route')
  // onRouteChange(to: Route, from: Route) {
  //   // update current place on route change
  //   let nextPlace: Place = store.getters.placeById(to.params.id);
  //   eventBus.$emit('highlightPlace', nextPlace);
  //   this.place = nextPlace;
  // }
}
</script>

<style lang="scss" scoped>
.dock {
  margin: 0;
  pointer-events: none;
  width: 100%;
  .dock-header {
    cursor: auto;
    pointer-events: all;
  }

  .place-label-container {
    cursor: pointer;
    padding: 10px !important;
    margin: 0 !important;
    .headline {
      display: flex !important;

      align-items: center;
      user-select: none;
    }
    .subtitle {
      display: flex;
      align-items: center;
      margin: 8px !important;
      text-transform: capitalize;
      color: gray;
      user-select: none;

      i {
        margin-right: 10px !important;
      }

      .badge {
        color: white;
        background-color: #26a69a;
        font-size: 1rem !important;
        padding-top: 1px;
        margin-left: 10px !important;
      }
    }
  }
}
</style>
