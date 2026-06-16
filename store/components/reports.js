import Http from '../../utils/http'
import Config from '../../config'

const state = {
    datalist:[],
    datalistConverce:[],
    datalistPayrep:[],
    formFromCallreport:[],
    doingclient:[],
    funnel:[],
    reestrdoc:[],
    reportDept: [],
    closeWork: [],
    reportTask: [],
    page: null,
    total: null,
    limit: null,
}

const getters = {
        datalist: state => state.datalist,
        datalistConverce: state => state.datalistConverce,
        datalistPayrep: state => state.datalistPayrep,
        formFromCallreport: state => state.formFromCallreport,
        doingclient: state => state.doingclient,
        funnel: state => state.funnel,
        reestrdoc: state => state.reestrdoc,
        reportDept: state => state.reportDept,
        closeWork: state => state.closeWork,
        reportTask: state => state.reportTask,

        page: state => state.page,
        pagination: state => {
        return {total: state.total, limit: state.limit, page: state.page}
        }
}

const actions = {
  findConverce:  ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      Http.post(Config.apiUrl + 'funnel/converce', payload)
        .then(resp => {
         commit('setConverce', resp.data)
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
  findPayrep:  ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      Http.post(Config.apiUrl + 'funnel/payrep', payload)
        .then(resp => {
         commit('setPayrep', resp.data)
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
  findReestrdoc:  ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      Http.post(Config.apiUrl + 'funnel/getdoc', payload)
        .then(resp => {
         commit('setReestrdoc', resp.data)
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
  findDoingclients:  ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      Http.post(Config.apiUrl + 'reports/doingclients', payload)
        .then(resp => {
         commit('setDoingclient', resp.data)
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
    findDoingclientsXlsl:  ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'reports/doclientsxsls', payload)
                .then(resp => {
                    commit('setDoingclient', resp.data)
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
  findFunnel:  ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      Http.post(Config.apiUrl + 'funnel/funnel', payload)
        .then(resp => {
          commit('setFunnel', resp.data)
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
  findReportOrk:  ({commit}, payload) => {
    return new Promise((resolve, reject) => {
      Http.post(Config.apiUrl + 'funnel/reportork', payload)
        .then(resp => {
            commit('setReportDept', resp.data)
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
    findCloseWorkOrk:  ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'funnel/closeworkork', payload)
                .then(resp => {
                    commit('setCloseWorkOrk', resp.data)
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
    getReportTask:  ({commit}, payload) => {
        return new Promise((resolve, reject) => {
            Http.post(Config.apiUrl + 'funnel/reporttask', payload)
                .then(resp => {
                    commit('getReportTask', resp.data)
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
  
}

const mutations = {
    set: (state, datalist) => {
        state.datalist = datalist
    },
    pagination:(state, pagination) => {
      state.page = pagination.page ? pagination.page : null
      state.total = pagination.total ? pagination.total : null
      state.limit = pagination.limit ? pagination.limit : null       
    },
    setConverce: (state, converce) => {
      state.datalistConverce = converce
    },
    setPayrep: (state, payrep) => {
      state.datalistPayrep = payrep
    },
    formFromCallreport: (state, payrep) => {  
      state.formFromCallreport = payrep
    },
    setDoingclient: (state, datalist) => {
      state.doingclient = datalist
    },
    setFunnel: (state, datalist) => {  
      state.funnel = datalist
    },
    setReestrdoc: (state,data) => {
      state.reestrdoc = data
    },
    setReportDept: (state,data) => {
      state.reportDept = data
    },
    setCloseWorkOrk: (state,data) => {
        state.closeWork = data
    },
    getReportTask: (state,data) => {
        state.reportTask = data
    },

    
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
