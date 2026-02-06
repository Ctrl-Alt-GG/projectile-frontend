<template>
  <BToastOrchestrator/>

  <b-modal id="passwordModal" ref="passwordModal" title="Authenticate yourself" no-close-on-backdrop no-close-on-esc
           ok-only no-header-close no-stacking @ok="pwUpdate">
    <div class="d-block">
      <div class="text-danger" v-if="badPW">Bad password</div>
      <div class="my-2">Password:</div>
      <b-input v-model="password" type="password"></b-input>
    </div>
  </b-modal>

  <b-container fluid class="mb-3">

    <header-row title="GG Projectile Admin"/>

  </b-container>
  <!-- announcement -->
  <b-container>
    <b-row>
      <b-col>
        <h1>Announcement</h1>
        <b-overlay :show="announcementChangeInProgress" variant="transparent" blur="0">
          <b-form class="py-2">
            <b-form-group>
              <div>
                Current announcement:
              </div>
              <b-form-textarea
                  placeholder=""
                  v-model="announcement"
                  :disabled="true"
              />
            </b-form-group>
            <b-form-group>
              <div>
                New announcement:
              </div>
              <b-form-textarea
                  placeholder="empty"
                  v-model="newAnnouncement"
                  v-on:keyup.ctrl.enter="setAnnouncement"
              />
            </b-form-group>
            <div class="py-2 text-end">
              <b-button
                  variant="success"
                  @click="newAnnouncement = announcement"
              >
                Copy current
              </b-button>
              &nbsp;
              <b-button
                  variant="danger"
                  @click="clearAnnouncement"
              >
                Clear
              </b-button>
              &nbsp;
              <b-button
                  variant="primary"
                  @click="setAnnouncement"
                  :disabled="newAnnouncement.length === 0"
                  title="You can also use ctrl+enter"
              >
                Set
              </b-button>
            </div>

          </b-form>
        </b-overlay>
      </b-col>
    </b-row>
  </b-container>
  <!-- servers -->
  <b-container fluid>
    <b-row>
      <b-col>
        <h1>Game servers</h1>
        <div class="text-end">
          <b-button @click="update" :disabled="gameServersChangeInProgress">force update</b-button>
        </div>
        <b-table
            class="my-5"
            striped hover
            :items="items(liveData)"
            :fields="fields"
            primary-key="address"
            :busy="gameServersChangeInProgress"
        >

          <template #cell(addresses)="data">
            <table>
              <tr v-for="addr in data.value">
                <td class="px-2"><code>{{ addr }}</code></td>
              </tr>
            </table>
          </template>

          <template #cell(game)="data">
            <img :src="getIcon(data.value)" style="height: 1.2em"/> {{ data.value }}
          </template>

          <template #cell(address)="data">
            <pre>{{ data.value }}</pre>
          </template>

          <template #cell(info)="data">
            <span class="text-muted">{{ data.value }}</span>
          </template>

          <template #cell(__players__)="data">
            {{ data.item.online_players }} / {{ data.item.max_players }}
          </template>

          <template #cell(__capabilities__)="data">
            <b-badge :variant="data.item.capabilities.player_count ? 'success' : 'secondary'">count</b-badge>&nbsp;
            <b-badge :variant="data.item.capabilities.player_names ? 'success' : 'secondary'">names</b-badge>
            <br>
            <b-badge :variant="data.item.capabilities.player_score ? 'success' : 'secondary'">score</b-badge>&nbsp;
            <b-badge :variant="data.item.capabilities.player_team ? 'success' : 'secondary'">team</b-badge>&nbsp;
          </template>

          <template #cell(last_update)="data">
            {{ (new Date(data.value)).toLocaleString("HU-hu") }}
          </template>

          <template #cell(players)="data">
            <table>
              <tr v-for="ply in data.value">
                <td class="px-2"><b>{{ ply.name }}</b></td>
                <td class="px-2" v-if="data.item.playersHasScore">{{ ply.score }}</td>
                <td class="text-muted px-2"><small>{{ ply.info }}</small></td>
              </tr>
            </table>
          </template>

          <!-- virtual cell -->
          <template #cell(__edit__)="data">
            <b-button variant="danger" @click="deleteServer(data.item.id)">Del</b-button>
          </template>

        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {inject, useTemplateRef} from 'vue'
import {BToastOrchestrator, useToastController} from "bootstrap-vue-next";
import getIcon from "@/data/icons.js";
import {BModal} from 'bootstrap-vue-next/components/BModal'


export default {
  components: {BToastOrchestrator, BModal},
  setup() {
    const api = inject('$api');
    const {show} = useToastController()
    const pwModal = useTemplateRef('passwordModal')
    return {api, show, pwModal}
  },
  data() {
    return {
      badPW: false,
      password: "",

      interval: null,
      fields: [
        "id",
        "addresses",
        "game",
        "name",
        "info",
        {
          key: "__players__",
          label: "Players",
        },
        {
          key: "__capabilities__",
          label: "Capabilities",
        },
        "last_update",
        "players",
        {
          key: "__edit__",
          label: ""
        },
      ],

      announcementChangeInProgress: false,
      gameServersChangeInProgress: false,

      announcement: '',
      newAnnouncement: '',

      liveData: {}
    }
  },

  methods: {
    getIcon,
    items(obj) {
      if (typeof (obj) !== 'object') {
        return []
      }
      return Object.entries(obj).map((e) => ({id: e[0], ...e[1]}));
    },
    httpError(op, err) {
      console.error(err);
      if (err.status === 401) {
        this.badPW = true;
        this.pwClear();
        return
      }
      this.show({
        props: {
          title: `Error in ${op}`,
          variant: 'danger',
          pos: 'middle-center',
          body: err.message,
        },
      })
    },
    pwUpdate() {
      this.badPW = false;
      localStorage.setItem('KEY', this.password)
      this.update()
      this.interval = setInterval(() => {
        this.update()
      }, 5000)
    },
    pwClear() {
      if (this.interval !== null) {
        clearInterval(this.interval)
      }
      localStorage.removeItem('KEY')
      this.password = ""
      this.pwModal.show()
    },
    update() {
      this.getAnnouncement()
      this.getServers()
    },
    getServers() {
      this.api.get("/admin/servers", {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.liveData = res.data;
      }).catch(err => {
        this.httpError("getServers", err);
      })
    },
    setAnnouncement() {
      this.announcementChangeInProgress = true
      this.api.put("/admin/announcement", {text: this.newAnnouncement}, {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.announcementChangeInProgress = false
        this.getAnnouncement();
      }).catch(err => {
        this.announcementChangeInProgress = false
        this.httpError("setAnnouncement", err);
      })
    },
    clearAnnouncement() {
      this.announcementChangeInProgress = true
      this.api.delete("/admin/announcement", {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.announcementChangeInProgress = false
        this.update();
      }).catch(err => {
        this.announcementChangeInProgress = false
        this.httpError("clearAnnouncement", err);
      })
    },
    getAnnouncement() {
      this.api.get("/admin/announcement", {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.announcement = res.data.text
      }).catch(err => {
        this.httpError("getAnnouncement", err);
      })
    },
    deleteServer(id) {
      this.gameServersChangeInProgress = true
      this.api.delete(`/admin/servers/${id}`, {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.gameServersChangeInProgress = false
        this.update();
      }).catch(err => {
        this.gameServersChangeInProgress = false
        this.httpError("deleteServer", err);
      })
    }
  },
  created() {
    const key = localStorage.getItem('KEY')
    if (key) {
      this.password = key
    }
  },
  mounted() {

    if (this.password === '') {
      this.pwModal.show()
    } else {
      this.update()
      this.interval = setInterval(() => {
        this.update()
      }, 5000)
    }

  },
  unmounted() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  }
}
</script>
