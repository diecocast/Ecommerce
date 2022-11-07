import mongoose from "mongoose"
import config from "../../config/config.js";
import __dirname from '../../utils.js'
import pino from "pino";

const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))

export default class MongoDBContainer{
    constructor(collection,schema){
        mongoose.connect(config.mongo.MONGO_URL)
        this.model = mongoose.model(collection,schema)
    }

    getAll = async() =>{
        try {
            let data = await this.model.find()
            let element = JSON.stringify(data)
            return element
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error:  ${error}`
        }

    }

    getById = async(idNumber) =>{
        try {
            const data = await this.getAll();
            if(data.id !=idNumber){
                let data = await this.model.find({id:{$eq:idNumber}}) 
                let element = JSON.stringify(data)
                return element
            }else{
                return "null"
            }

        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error:  ${error}`
        }
    }
    deleteById = async(idDelete) =>{
        try {
            const data = await this.getAll()
              let result = await this.model.deleteOne({id:idDelete})            
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error:  ${error}`
        }        
    }

}