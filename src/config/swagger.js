import swaggerJsdoc from 'swagger-jsdoc'
import __dirname from '../utils.js'

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title: "Api Ecommerce",
            description: "Testing basic functions api<br><b><li>So you can try first login please</li><li>Las otras partes de la API tendran que ser testeadas desde la pagina web por cuestiones de seguridad</li></b>",
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)

export default specs