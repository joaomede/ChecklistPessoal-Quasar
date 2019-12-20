<template>
  <div class="divPrincipal">
    <q-card>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab
          v-if="activelist.length > 0"
          name="ativo"
          label="Ativas"
        />
        <q-tab
          v-if="finishedlist.length > 0"
          name="concluido"
          label="Concluídas"
        />
      </q-tabs>

      <q-separator />

      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel
          name="ativo"
          style="padding: 0px"
        >
          <q-list
            bordered
            style="max-width: 900px; margin: auto;"
          >
            <q-item
              v-for="item in activelist"
              :key="item.id"
              v-ripple
              clickable
              @click="showActivityTask(item)"
            >
              <q-item-section
                avatar
                top
              >
                <q-avatar
                  icon="event_note"
                  color="primary"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  {{ item.title }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon
                  name="check"
                  color="primary"
                  @click.stop="showFinishTask(item)"
                />
              </q-item-section>

              <q-item-section side>
                <q-icon
                  name="delete_sweep"
                  color="grey ligten-1"
                  @click.stop="showDeleteTask(item)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>

        <q-tab-panel
          name="concluido"
          style="padding: 0px"
        >
          <q-list
            bordered
            style="max-width: 900px; margin: auto;"
          >
            <q-item
              v-for="item in finishedlist"
              :key="item.id"
              v-ripple
              clickable
              @click="showFinishedTask(item)"
            >
              <q-item-section
                avatar
                top
              >
                <q-avatar
                  icon="event_note"
                  color="primary"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">
                  {{ item.title }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-icon
                  name="restore"
                  color="primary"
                  @click.stop="showRestoreTask(item)"
                />
              </q-item-section>

              <q-item-section side>
                <q-icon
                  name="delete_sweep"
                  color="grey ligten-1"
                  @click.stop="showDeleteTask(item)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
export default {
  props: {
    activelist: {
      type: Array,
      default: function () {
        return []
      }
    },
    finishedlist: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      tab: 'ativo'
    }
  },
  methods: {
    showActivityTask (item) {
      this.$emit('showActivityTask', item)
    },
    showFinishTask (item) {
      this.$emit('showFinishTask', item)
    },
    showDeleteTask (item) {
      this.$emit('showDeleteTask', item)
    },
    showFinishedTask (item) {
      this.$emit('showFinishedTask', item)
    },
    showRestoreTask (item) {
      this.$emit('showRestoreTask', item)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
