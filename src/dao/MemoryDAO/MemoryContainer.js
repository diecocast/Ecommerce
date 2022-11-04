import __dirname from '../../utils.js'
import pino from "pino";

const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))

export default class MemoryContainer{
    constructor(){
        this.data = []
    }
    getAll = () =>{
        return this.data
    }

    getById = async(idNumber) =>{
        try {
            const data = await this.getAll();
            if(data.id !=idNumber){
                console.log(data.find((element) => element.id == idNumber))
                let info = data.find((element) => element.id == idNumber)
                return info
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
            if (data[data.length-1].id>=idDelete) {
              this.data = data.filter((item) => item.id != idDelete)
            } else {
                return "El id pedido no existe"
            }
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error:  ${error}`
        }        
    }
}