import mitt from 'mitt'

export const TOPIC = {
  // ui
  UI_TOAST: 'ui.toast',
  UI_GOTO: 'ui.route.goto',
  NET_STATUS: 'net.status.changed',
  // flags
  FLAGS_REQ: 'flags.refresh.request',
  FLAGS_OK: 'flags.refresh.success',
  FLAGS_ERR: 'flags.refresh.error',
  // auth
  AUTH_LOGIN_REQ: 'auth.login.request',
  AUTH_LOGIN_OK: 'auth.login.success',
  AUTH_LOGIN_ERR: 'auth.login.error',
  AUTH_REGISTER_REQ: 'auth.register.request',
  AUTH_REGISTER_OK: 'auth.register.success',
  AUTH_REGISTER_ERR: 'auth.register.error',
  AUTH_LOGOUT: 'auth.logout',
}

export const bus = mitt()
