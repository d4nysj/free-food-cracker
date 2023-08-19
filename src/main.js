const path = require("path");
const { recognizeStore } = require("./modules/store-detector");

async function main() {
  try {
    const image = path.join(__dirname, "assets/TB.jpeg")

    const { store, lines, text, qrResults } = await recognizeStore(image)

    console.log(store, lines, text, qrResults)
    
    
    if (store == "MC" ) {
        const qrResults = await getQRParser(image)
        console.log('qrResults', qrResults)

    } else if (store == "TB") {
      
    }
    
    const nPedidoBk = parseInt(lines[2].replace(/\D/g, '') || 0)
    //console.log('nPedidoBk', nPedidoBk)
  } catch (error) {
    console.log(error.message)
  }
  
}

main()