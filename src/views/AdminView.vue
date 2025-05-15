<template>
  <BToastOrchestrator />
  <b-container fluid class="my-3">

    <b-row>
      <b-col md="6">
        <img src="@/assets/logo-voros.svg" style="height: 5em"/> <span class="mx-2">GG-Admin</span>
      </b-col>
      <b-col md="6" class="pt-2">
        Password:
        <b-input v-model="password" type="password" @change="pwUpdate"></b-input>
      </b-col>
    </b-row>

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
                  v-model="liveData.announcement.text"
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
                  @click="newAnnouncement = liveData.announcement.text"
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
            :items="liveData.gameServers"
            :fields="fields"
            primary-key="address"
            :busy="gameServersChangeInProgress"
        >

          <template #cell(game)="data">
            <img :src="getIcon(data.value)" style="height: 1.2em" /> {{ data.value }}
          </template>

          <template #cell(address)="data">
            <pre>{{ data.value }}</pre>
          </template>

          <template #cell(info)="data">
            <span class="text-muted">{{ data.value }}</span>
          </template>

          <template #cell(__players__)="data">
            {{ data.item.playerCount }} / {{ data.item.maxPlayers }}
          </template>

          <template #cell(__meta__)="data">
            <b-badge :variant="data.item.meta.knowOnlinePlayerCount ? 'success' : 'secondary'">count</b-badge>&nbsp;
            <b-badge :variant="data.item.meta.knowPlayers ? 'success' : 'secondary'">names</b-badge>&nbsp;
            <b-badge :variant="data.item.meta.playersHasScore ? 'success' : 'secondary'">score</b-badge>&nbsp;
          </template>

          <template #cell(onlinePlayers)="data">
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
            <b-button variant="danger" @click="deleteServer(data.item.address)">Del</b-button>
          </template>

        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {inject} from 'vue'
import {BToastOrchestrator, useToastController} from "bootstrap-vue-next";
import getIcon from "@/data/icons.js";

export default {
  components: {BToastOrchestrator},
  setup() {
    const api = inject('$api');
    const {show} = useToastController()
    return {api, show}
  },
  data() {
    return {
      password: "",
      interval: null,
      fields: [
        "address",
        "game",
        "longName",
        "info",
        {
          key: "__players__",
          label: "Players",
        },
        {
          key: "__meta__",
          label: "Meta",
        },
        "lastUpdate",
        "onlinePlayers",
        {
          key: "__edit__",
          label: ""
        },
      ],

      announcementChangeInProgress: false,
      gameServersChangeInProgress: false,

      newAnnouncement: '',

      liveData: {
        announcement: {
          text: "",
        },
        gameServers: []
      }
    }
  },

  methods: {
    getIcon,
    error(op,msg) {
      console.error(msg);
      this.show({
        props: {
          title: `Error in ${op}`,
          variant: 'danger',
          pos: 'middle-center',
          body: msg,
        },
      })
    },
    pwUpdate() {
      localStorage.setItem('KEY', this.password)
    },
    update() {
      this.api.get("/bundle").then(res => {
        this.liveData = res.data;
      }).catch(err => {
        this.error("update", err.message);
      })
    },
    setAnnouncement() {
      this.announcementChangeInProgress = true
      this.api.put("/announcement", {text: this.newAnnouncement}, {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.announcementChangeInProgress = false
        this.update();
      }).catch(err => {
        this.announcementChangeInProgress = false
        this.error("setAnnouncement", err.message);
      })
    },
    clearAnnouncement() {
      this.announcementChangeInProgress = true
      this.api.delete("/announcement", {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.announcementChangeInProgress = false
        this.update();
      }).catch(err => {
        this.announcementChangeInProgress = false
        this.error("clearAnnouncement", err.message);
      })
    },
    deleteServer(address) {
      this.gameServersChangeInProgress = true
      this.api.delete(`/servers/${address}`, {
        headers: {
          "Authorization": "Key " + this.password,
        }
      }).then(res => {
        this.gameServersChangeInProgress = false
        this.update();
      }).catch(err => {
        this.gameServersChangeInProgress = false
        this.error("deleteServer", err.message);
      })
    }
  },

  mounted() {
    const key = localStorage.getItem('KEY')
    if (key) {
      this.password = key
    }

    this.update()
    this.interval = setInterval(() => {
      this.update()
    }, 5000)
  },
  unmounted() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  }
}
</script>


<style>

</style>
