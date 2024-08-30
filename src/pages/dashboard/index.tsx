import { Layout } from '@/components/custom/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { invoke } from '@tauri-apps/api'
import { useEffect, useState } from 'react'
import { Task } from "../tasks/data/schema";


export default function Dashboard() {
  const [_, setTasks] = useState<Task[]>([]);
  const [totalDone, setTotalDone] = useState(0);
  const [totalInProgress, setTotalInProgress] = useState(0);
  const [totalBacklog, setTotalBacklog] = useState(0);
  const [totalTodo, setTotalTodo] = useState(0);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks: Task[] = await invoke("get_tasks");
        setTasks(fetchedTasks);

        const done = fetchedTasks.filter(task => task.status === 'done').length;
        const inProgress = fetchedTasks.filter(task => task.status === 'in-progress').length;
        const backlog = fetchedTasks.filter(task => task.status === 'backlog').length;
        const todo = fetchedTasks.filter(task => task.status === 'todo').length;

        setTotalDone(done);
        setTotalInProgress(inProgress);
        setTotalBacklog(backlog);
        setTotalTodo(todo);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }

    fetchTasks();
  }, []);

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      {/* <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
        </div>
      </Layout.Header> */}

      {/* ===== Main ===== */}
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='reports'>Reports</TabsTrigger>
              <TabsTrigger value='notifications'>Notifications</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Todo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalTodo}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Backlog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalBacklog}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalInProgress}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Done
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{totalDone}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Body>
    </Layout>
  )
}