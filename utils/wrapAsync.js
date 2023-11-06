//Creating Wrap Async function to handle the error
// this is used in app.js file 

module.exports = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    }
}