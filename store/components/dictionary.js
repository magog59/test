const state = {
    yesNoList:
        [
            {id: 10, name: 'ДА'},
            {id: 20, name: 'НЕТ'},
        ],
    is_LprList:
        [
            {id: 10, name: 'ДА'},
            {id: 20, name: 'НЕТ'},
        ],
    clientType:
        [
            {id: 10, name: 'Холодный'},
            {id: 20, name: 'Теплый'},
            {id: 30, name: 'Действующий'},
            {id: 40, name: 'На удалении'}
        ],
    ABCList:
        [
            {id: 10, name: 'A'},
            {id: 20, name: 'B'},
            {id: 30, name: 'C'},
        ],
    statusTask: [
        {id: 10, name: 'В работе'},
        {id: 20, name: 'Готово'},
        {id: 30, name: 'Удален'},
    ],
    callsStatus: [
        {id: 10, name: 'В работе'},
        {id: 20, name: 'Отказ'},
        {id: 30, name: 'Переведен в лид'},
    ],
    callsShow: [
        {id: 10, name: 'Просмотрено'},
        {id: 20, name: 'Не просмотрено'},
    ],
    statusLead: [
        {id: 10, name: 'Не обработан'},
        {id: 20, name: 'Не дозвонился'},
        {id: 30, name: 'Не вышел на ЛПР'},
        {id: 40, name: 'ЛПР'},
        {id: 50, name: 'Отказ'},
        {id: 60, name: 'Успех'},
    ],
    statusAgreement: [
        {id: 10, name: 'Согласован'},
        {id: 20, name: 'Отказ'},
        {id: 30, name: 'Новый'}
    ],
    commentType: [
        {id: 10, name: 'Не дозвонился'},
        {id: 20, name: 'Не вышел на ЛПР'},
        {id: 30, name: 'ЛПР'},
        {id: 40, name: 'Отказ'},
        {id: 50, name: 'Успех'},
    ],
    kpStatuses: [
        {id: 10, name: 'Составлено'},
        {id: 20, name: 'Отправлено'},
        {id: 30, name: 'Ценовые переговоры по КП'},
        {id: 40, name: 'Договор'},
        {id: 50, name: 'Отмена'},
    ],
    timelineStatus: [
        {id: 10, name: 'Партия'},
        {id: 20, name: '1 год'},
        {id: 30, name: '2 годa'},
        {id: 40, name: '3 годa'},
        {id: 50, name: '4 годa'},
        {id: 60, name: '5 лет'},
        {id: 70, name: 'Бессрочно'},
    ],
    newStatusOrk: [
        //Запуск
        {id: 10, name: 'Получение заявки'},  //1 date deloy
        //Сбор документов --collectDoc
        {id: 20, name: 'Сбор документов для запуска'},   //5
        {id: 25, name: 'Согласование договора с поставщиком'},   //3
        {id: 30, name: 'Сбор документов для АСП'},   //15
        //Анализ документации и согласование макета --analysis
        {id: 40, name: 'Соглaсование макета'},   //5
        {id: 41, name: 'Разработка технической документации'},   //10
        {id: 42, name: 'Доработка документации клиентом'},   //5
        {id: 45, name: 'Изготовление образца'},   //20
        {id: 49, name: 'Выезд'},   //10
        {id: 50, name: 'Анализ документов поставщиком'},   //2
        //Оформление документа --decorateDoc
        {id: 60, name: 'Оформление ПИ'},    //25
        {id: 70, name: 'Согласование ПИ'},   //3
        {id: 80, name: 'В печать/Регистрация'},  //2
        //Работа закрыта  --workClose
        {id: 90, name: 'Занесение документов в СРМ'},  //1
        //Доставка из органа  --transfer
        {id: 100, name: 'Доставка оригиналов из ОС'},  //10
        //Доставка документов клиенту --transferClient
        {id: 110, name: 'Доставка оригинала клиенту'}, //10
        //Завершение
        {id: 140, name: 'Обзвон по качеству'},
        {id: 150, name: 'Завершен'},
        {id: 160, name: 'Отказ'},
        {id: 170, name: 'Зависшая работа'},
    ],

    constStatusOrk: {
        'Получение заявки': 10,
        'Сбор документов для запуска': 20,
        'Согласование договора с поставщиком': 25,
        'Сбор документов для АСП': 30,
        'Соглaсование макета': 40,
        'Разработка технической документации': 41,
        'Доработка документации клиентом': 42,
        'Изготовление образца': 45,
        'Выезд': 49,
        'Анализ документов поставщиком': 50,
        'Оформление ПИ': 60,
        'Согласование ПИ': 70,
        'В печать/Регистрация': 80,
        'Занесение документов в СРМ': 90,
        'Доставка оригиналов из ОС': 100,
        'Доставка оригинала клиенту': 110,
        'Обзвон по качеству': 140,
        'Завершен': 150,
        'Отказ': 160,
        'Зависшая работа': 170
    },

    getType: [
        {id: 10, name: 'Звонок'},
        {id: 20, name: 'ЭК'},
        {id: 30, name: 'Заявка'},
        {id: 40, name: 'КП'},
        {id: 50, name: 'Договор'},
        {id: 60, name: 'ОРК'},
    ],
    getTax: [
        {id: 10, name: 'ООО Современные решения'},
        {id: 20, name: 'ИП Филимонов'},
    ],
    mapFunnel: [
        {id: 1, name: 'ЭК'},
        {id: 0, name: 'Заявка'},
        {id: 3, name: 'Коммерческие'},
        {id: 4, name: 'Договоры'},
        {id: 5, name: 'Выручка'},
        {id: 6, name: 'Маржа'},
        {id: 7, name: 'Средняя маржа'},
        {id: 8, name: 'Процент маржи'},

    ],
    mapFunnelElem: [
        {id: 15, name: 'По рекомендации'},
        {id: 12, name: 'Действующий клиент'},
        {id: 14, name: 'Рассылка'},
        {id: 13, name: 'Сайт'},
        {id: 11, name: 'Холодный звонок'},
    ],

}

const getters = {

    statusAgreement: state => state.statusAgreement,
    clientType: state => state.clientType,
    ABCList: state => state.ABCList,
    callsStatus: state => state.callsStatus,
    statusTask: state => state.statusTask,
    statusLead: state => state.statusLead,
    kpStatuses: state => state.kpStatuses,
    timelineStatus: state => state.timelineStatus,
    yesNoList: state => state.yesNoList,
    is_LprList: state => state.is_LprList,
    statusOrk: state => state.statusOrk,
    getType: state => state.getType,
    mapFunnelElem: state => state.mapFunnelElem,
    mapFunnel: state => state.mapFunnel,
    newStatusOrk: state => state.newStatusOrk,
    delayDays: state => state.delayDays,
    constStatusOrk: state => state.constStatusOrk
}

const actions = {}


const mutations = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}
