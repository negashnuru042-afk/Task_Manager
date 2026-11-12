import express from "express";
import Task from "../models/task.js";
import { isValidObjectId } from "mongoose";
const router=express.Router();
//get all tasks
router.get("/",async(req,res)=>{
try{
const tasks=await Task.find()
res.status(200).json(tasks)
}catch(error){
res.status(500).json({message:error.message})
}
})

router.get("/completedtasks",async(req,res)=>{
try{
const tasks=await Task.find()
res.status(200).json(tasks.filter((task)=>task.completed===true))
}catch(error){
res.status(500).json({message:error.message})
}
})
//get a single task
router.get("/:id",async(req,res)=>{
const{id}=req.params;
if(!isValidObjectId(id)){
    return res.status(400).json({message:"Invalid ID"})
}
try{
const task= await Task.findById(id);
if(!task){
return res.status(404).json({message:"Task not found"})
}
res.status(200).json(task)
}catch(error){
res.status(500).json({message:error.message})
}

})


//create task
router.post("/", async (req, res) => {
  const { title, completed } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "title is required and must be a string" });
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ message: "completed must be a boolean" });
  }

  try {
    const task = await Task.create({ title: title.trim(), completed });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




//update task
router.patch("/:id",async(req,res)=>{
const{id}=req.params;
if(!isValidObjectId(id)){
return res.status(400).json({message:"Invalid ID"});
}
try{

const task= await Task.findByIdAndUpdate(id,
req.body,
  {
                new: true,
                runValidators: true
  }
);
if(!task){
return res.status(404).json({message:"Task not found"})
}
res.status(200).json(task)
}catch(error){
return res.status(500).json({message:error.message})
}
})
//delete task
router.delete("/:id",async(req,res)=>{
const{id}=req.params;
if(!isValidObjectId(id)){
return res.status(400).json({message:"Invalid ID"});
}
try{
const task=await Task.findByIdAndDelete(id);
if(!task){
return res.status(404).json({message:"Task not found"})
}
res.status(200).json({message:" Task Deleted successfully"})
}catch(error){
res.status(500).json({message:error.message});
}
})
export default router;
