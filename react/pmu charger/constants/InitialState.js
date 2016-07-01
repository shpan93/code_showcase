export const INITIAL_STATE = {
data: {
    chargesData: [],
    historyData: [],
    isFetching:false,
},
user:{
    sessionUid:null,
    chargeAmounts: []
},
    charge:{
        chargeList:[],
        errorsParsing:[],
        isOpened:false,
        isProcessing:false
    }
};
