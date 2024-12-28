import { Request, Response } from "express";
import prisma from "../prisma/prismaClient";


export const createTask = async (req: any, res: any) => {
  const { title, startTime, endTime, priority, status, userId } = req.body;

  try {
    const task = await prisma.task.create({
      data: { title, startTime: new Date(startTime), endTime: new Date(endTime), priority, status, userId },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to create task" });
  }
};


export const updateTask = async (req: any, res: any) => {
  const { id } = req.params;
  const { title, startTime, endTime, priority, status, userId } = req.body;

  try {
    const task = await prisma.task.updateMany({
      where: { id: Number(id), userId },
      data: { title, startTime: new Date(startTime), endTime: new Date(endTime), priority, status },
    });

    if (!task.count) {
      return res.status(404).json({ error: "Task not found or not authorized" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Failed to update task" });
  }
};


export const getTasks = async (req: any, res: any) => {
  const { userId } = req.body;
  const { page = 1, limit = 10 } = req.query;

  try {
    const tasks = await prisma.task.findMany({
      where: { userId },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const totalCount = await prisma.task.count({ where: { userId } });
    res.status(200).json({ tasks, totalCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};


export const getTaskStatistics = async (req: Request, res: Response) => {
    const { userId } = req.body;
  
    try {
      
      const tasks = await prisma.task.findMany({
        where: { userId },
      });
  
      
      const totalTasks = tasks.length;
  
      
      const completedTasks = tasks.filter((task) => task.status === "finished");
      const pendingTasks = tasks.filter((task) => task.status === "pending");
  
      
      const completedPercent = totalTasks
        ? (completedTasks.length / totalTasks) * 100
        : 0;
      const pendingPercent = totalTasks
        ? (pendingTasks.length / totalTasks) * 100
        : 0;
  
      
      const pendingStats = pendingTasks.map((task) => {
        const now = new Date();
        const timeLapsed =
          now < task.startTime
            ? 0
            : (now.getTime() - task.startTime.getTime()) / (1000 * 60 * 60); 
        const balanceTime =
          now > task.endTime
            ? 0
            : (task.endTime.getTime() - now.getTime()) / (1000 * 60 * 60); 
  
        return {
          priority: task.priority,
          timeLapsed: timeLapsed.toFixed(2), 
          balanceTime: balanceTime.toFixed(2),
        };
      });
  
      
      const averageCompletionTime = completedTasks.length
        ? completedTasks.reduce((sum, task) => {
            return (
              sum +
              (task.endTime.getTime() - task.startTime.getTime()) /
                (1000 * 60 * 60) 
            );
          }, 0) / completedTasks.length
        : 0;
  
      
      res.status(200).json({
        totalTasks,
        completedPercent: completedPercent.toFixed(2), 
        pendingPercent: pendingPercent.toFixed(2),
        pendingStats,
        averageCompletionTime: averageCompletionTime.toFixed(2),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch task statistics" });
    }
  };
