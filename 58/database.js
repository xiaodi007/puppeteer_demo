const mysql = require('mysql')
const config = require('./config.json')

const pool = mysql.createPool(config)

let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {

                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })
}

// 获取未爬取的小区名单
async function selectAllData( ) {
    let sql = 'SELECT final_url FROM `58url` WHERE `status` = 1'
    let dataList = await query( sql )
    return JSON.parse(JSON.stringify(dataList))
}

// 插入爬取的小区信息
async function saveAllData(data){
    for (const rowdata of data) {
        await query( 'INSERT INTO  58_estate SET name = ?, price = ?, division = ?, url = ? ',
            [rowdata.name, rowdata.price, rowdata.division, rowdata.url] )

    }
}

// 将完成爬取的小区状态设置为已爬取
async function setUrl(url){
    await query(
        "UPDATE 58url SET status = 0 WHERE final_url = ?",
        url
    )
}

// 将未爬取的小区名单转为list
async function get_untorch_urls() {
    let data_list = []
    let dataList = await selectAllData()
    dataList.forEach((x) => {data_list.push(x.final_url)})
    return data_list

}

module.exports = { saveAllData, setUrl, get_untorch_urls }