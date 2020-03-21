if(process.env.NODE_ENV === 'production'){
  // module.exports = {mongoURI: "mongodb+srv://jvazquez34139:Elifunk2511@cluster0-kr3s3.mongodb.net/test?retryWrites=true&w=majority"}
  module.exports = {mongoURI: "mongodb://localhost/example"}
}else{
  module.exports = {mongoURI: "mongodb://localhost/example"}
}
