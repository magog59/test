import Http from '../../utils/http'
import Config from '../../config'
import errors from "../../utils/errors"

const state = {
    ork: [],
    datalist: [],
    page: null,
    total: null,
    limit: null,
    notice: null,
    notOrk: null,
    clients: null,
    itemDoc: null,
    varReturnStore: null,
    startNot: null,
    collectDocNot: null,
    analysisNot: null,
    decorateDocNot: null,
    workCloseNot: null,
    transferNot: null,
    transferClientNot: null,
    dateOrkDelay: null,
    userListMarge: []

}

const getters = {
    ork: state => state.ork,
    clients: state => state.city,
    datalist: state => state.datalist,
    itemDoc: state => state.itemDoc,
    page: state => state.page,
    returnStore: state => state.varReturnStore,
    startNot: state => state.startNot,
    collectDocNot: state => state.collectDocNot,
    analysisNot: state => state.analysisNot,
    decorateDocNot: state => state.decorateDocNot,
    workCloseNot: state => state.workCloseNot,
    transferNot: state => state.transferNot,
    transferClientNot: state => state.transferClientNot,
    dateOrkDelay: state => state.dateOrkDelay,
    userListMarge: state => state.userListMarge,

    pagination: state => {
        return {total: state.total, limit: state.limit, page: state.page, notice: state.notice, notOrk: state.notOrk}
    },

}

const actions = {
    find: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            const newPayload = {...payload}
            newPayload.isactive = 4;

            Http.post(Config.apiUrl + 'ork', newPayload)
                .then(resp => {
                    commit('setOrk', resp.data)
                    commit('pagination', resp.pagination)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },
    delete: ({commit, state}, id) => {
        return new Promise((resolve, reject) => {
            Http.get(Config.apiUrl + 'ork/delete?id=' + id)
                .then((r) => {
                    const arr = [];
                    state.datalist.map((el) => {
                        if (el.id !== id) {
                            arr.push(el)
                        }
                    })
                    commit('set', arr)
                    resolve(r)
                }).catch(err => {
                if (err.response) {
                    commit('app/setError', err.response.data.message, {root: true})
                    reject(err)
                }
            })
        })
    },
    save: ({commit}, model) => {
        console.log("store save:", model)
        return new Promise((resolve, reject) => {
            if (model.id != null && model.id != 0) {
                Http.post(Config.apiUrl + 'ork/update', model)
                    .then(resp => {
                        resolve(resp)
                    })
                    .catch(err => {
                        if (err.response) {
                            commit('app/setError', errors.methods.toString(err.response.data.message), {root: true})
                            reject(err.response.data)
                        }
                    })
            } else {
                Http.post(Config.apiUrl + 'ork/create', model)
                    .then(resp => {
                        resolve(resp)
                    })
                    .catch(err => {
                        if (err.response) {
                            commit('app/setError', errors.methods.toString(err.response.data.message), {root: true})
                            reject(err.response.data)
                        }
                    })
            }
        })
    },

    findOnId: ({commit}, id) => {
        return new Promise((resolve, reject) => {
            Http.get(Config.apiUrl + 'ork/findonid?id=' + id)
                .then(resp => {
                    commit('set', resp.data)
                    commit('pagination', resp.pagination)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },

    itemDoc: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/itemdoc', payload)
                .then(resp => {
                    commit('setItemDoc', resp.data)
                    commit('pagination', resp.pagination)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },
    restore: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/restore', payload)
                .then(resp => {
                    this.find()
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },

    close: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/close', payload)
                .then(resp => {
                    this.find()
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },

    createNewState: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/createnewstate', payload)
                .then(resp => {
                    this.find()
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },

    findOrkNotice: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/findnoticenew', payload)
                .then(resp => {
                    commit('setOrkNotice', resp.data)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },
    newQuery: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/newquery', payload)
                .then(resp => {
                    commit('set', resp.data)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },

    setLimit: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/setlimit', payload)
                .then(resp => {
                    commit('set', resp.data)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },
    findDelayOrkDate: ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/finddate', payload)
                .then(resp => {
                    commit('setDateOrkDelay', resp.data)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },
    getUserListMarge: ({commit}) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'ork/getmargeforuserlist',)
                .then(resp => {
                    commit('setUserListMarge', resp.data)
                    resolve(resp)
                })
                .catch(err => {
                    if (err.response) {
                        commit('app/setError', err.response.data.message, {root: true})
                        reject(err.response.data)
                    }
                })
        })
    },
}


const mutations = {

    setOrk: (state, datalist) => {
        state.ork = datalist
    },
    set: (state, datalist) => {
        state.datalist = datalist
    },
    pagination: (state, pagination) => {
        state.page = pagination.page ? pagination.page : null
        state.total = pagination.total ? pagination.total : null
        state.limit = pagination.limit ? pagination.limit : null
        state.notice = pagination.notice ? pagination.notice : null
        state.notOrk = pagination.notOrk ? pagination.notOrk : null
    },
    clients: (state, clients) => {
        state.clients = clients
    },
    setItemDoc: (state, datalist) => {
        state.itemDoc = datalist
    },
    setReturnStore: (state, datalist) => {
        state.varReturnStore = datalist
    },
    setDateOrkDelay: (state, datalist) => {
        state.dateOrkDelay = datalist
    },
    setOrkNotice: (state, datalist) => {
        state.startNot = datalist.start
        state.collectDocNot = datalist.collectDoc
        state.analysisNot = datalist.analysis
        state.decorateDocNot = datalist.decorateDoc
        state.workCloseNot = datalist.workClose
        state.transferNot = datalist.transfer
        state.transferClientNot = datalist.transferClient
    },
    setUserListMarge: (state, datalist) => {
        state.userListMarge = datalist
    },
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}


