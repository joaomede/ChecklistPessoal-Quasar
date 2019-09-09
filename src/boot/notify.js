import { Notify } from "quasar";

export default async ({Vue}) => {
  Vue.prototype.$notificacao = function(mensagem, cor) {
    Notify.create({
      message: mensagem,
      color: cor
    });
  };
}

Notify.setDefaults({
  //position: 'bottom',
  timeout: 2500,
  textColor: "white",
  actions: [{ icon: "close", color: "white" }]
});
