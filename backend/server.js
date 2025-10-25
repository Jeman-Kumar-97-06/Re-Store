require('dotenv').config();
const {McpServer, ResourceTemplate} = require('@modelcontextprotocol/sdk/server/mcp.js')
const {StreamableHTTPServerTransport}
                 = require('@modelcontextprotocol/sdk/server/streamableHttp.js')
const Product    = require('./models/productModel');
const cors       = require('cors');
const express    = require('express');
const mongoose   = require('mongoose');
const app        = express();
const path       = require('path');

const uRts       = require('./routes/users');
const cRts       = require('./routes/carts');
const pRts       = require('./routes/products');

app.use(express.json());
app.use(cors());

const mcpserver = new McpServer({
  name : "test",
  version : "1.0.0"
});

mcpserver.registerResource(
  'phones',
  new ResourceTemplate('phones://{phoneId?}',{list:undefined}),
  {
    title:'Phones Database',
    description : "Fetches phone details from MongoDB Atlas"
  },
  async (uri,{phoneId}) => {
    if (!phoneId){
      const products_all = await Product.find({}).sort({createdAt:-1});
      return {
        contents : [
          {
            uri:uri.href,
            text:JSON.stringify(products_all,null,2)
          }
        ]
      }
    }
    else {
      const product   = await Product.findById(phoneId);
      if (!product) {
        return {
          contents:[
            {
              uri:uri.href,
              text:`No product found for ID ${phoneId}`
            }
          ]
        }
      }
      return {
        contents : [
          {
            uri:uri.href,
            text:JSON.stringify(product,null,2)
          }
        ]
      }
    }
  }
)

app.post('/mcp',async (req,res)=>{
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator:undefined,
    enableJsonResponse:true
  });
  res.on('close',()=>{
    transport.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req,res,req.body);
})

app.use('/api/users',uRts);
app.use('/api/carts',cRts);
app.use('/api/products',pRts);

//What to do in production:
if (process.env.NODE_ENV==='production') {
  const clientPath = path.join(__dirname,'../frontend/dist');
  app.use(express.static(clientPath));
  app.get('/',(req,res)=>{
    res.sendFile(path.join(clientPath,'index.html'));
  })
}

//connect to mongoose database server
mongoose.connect(process.env.MONGOURL).then(()=>{
  app.listen(process.env.PORT,()=>{console.log("Connected to database and listening to request at ",process.env.PORT)})
}).catch(error=>{console.log(error)})
 