const axios = require('axios');

function pageDetails (path) {
    return new Promise((resolve, reject) => {
        var pageData = [];
        getDetail(path) 
        function getDetail (path) {
            axios.get(path)
                .then((res) => {
                    if (res.data.paging == null) {
                        pageData.join(',');
                        console.log('last page is empty');
                        return pageData;
                    }
                    pageData = pageData.concat(res.data.data)
                    var nextPage = res.data.paging.next;
                    if (nextPage == null) {
                        pageData.join(',');
                        console.log('done');
                        return pageData
                    } else {
                        var judge = nextPage.indexOf('limit=25');
                        if (judge > -1) {
                            var newNextPage = nextPage.replace('limit=25', 'limit=100');
                            console.log(newNextPage);
                            getDetail(newNextPage);
                        } else {
                            console.log(nextPage);
                            getDetail(nextPage)
                        }
                    }
                })
                .then((data) => {   
                    if (data != undefined) {
                        var pageIdArr = [];
                        data.forEach((val) => {
                            var pageDate = new Date(val.created_time);
                            var pageYearOnly = (pageDate.getFullYear()).toString();
                            var pageMonthOnly = (pageDate.getMonth() + 1).toString();
                            if (pageMonthOnly.length < 2) {
                                pageMonthOnly = '0' + pageMonthOnly;
                            }
                            var pageDateOnly = (pageDate.getDate()).toString();
                            if (pageDateOnly.length < 2) {
                                pageDateOnly = '0' + pageDateOnly;
                            }
                            var newDateWithoutTime = `${pageYearOnly}-${pageMonthOnly}-${pageDateOnly}`;
                            val.created_time = newDateWithoutTime;
                            pageIdArr.push(val.id);
                        })
                        var doubleArr = [];
                        doubleArr.push(data,pageIdArr);
                        resolve(doubleArr)
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    })
}


module.exports.pageDetails = pageDetails;
