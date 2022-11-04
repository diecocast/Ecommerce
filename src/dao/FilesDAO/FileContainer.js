import fs from 'fs'
import __dirname from '../../utils.js'
import pino from "pino";

const streams = [{level:'info',stream:process.stdout},{level:'warn',stream:pino.destination(__dirname + '/warn.log')},{level:'error',stream:pino.destination(__dirname+'/error.log')}]
const logger = pino({},pino.multistream(streams))

export default class FileContainer{
    constructor(path){
        this.path = path
    }
    getAll = async() =>{
        try {
            if(fs.existsSync(this.path)){      
                let data = await fs.promises.readFile(this.path,'utf-8');
                let lista = JSON.parse(data);
                return lista;
            }else{
                return [];
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
                const borrar = data.filter((item) => item.id != idDelete)
                await fs.promises.writeFile(this.path, JSON.stringify(borrar,null,'\t'))
            } else {
                return "El id pedido no existe"
            }
        } catch (error) {
            logger.error(`Hay un error ${error}`)
            return `Hay un error:  ${error}`
        }        
    }
    getById = async(idNumber) =>{
        try {
            const data = await this.getAll();
            if(data.id !=idNumber){
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
}