export type Project = {
  id: number;
  user_id: number;
  name: string;
  description: string;
  color: string;
  status: "active" | "planning" | "archived";
  task_count?: number;
  done_count?: number;
};

export type Task = {
  id: number;
  project_id: number;
  user_id: number;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  due_date?: string;
  project_name?: string;
  project_color?: string;
};
