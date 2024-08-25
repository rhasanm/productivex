import { Layout } from '@/components/custom/layout'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { invoke } from '@tauri-apps/api'
import { useEffect, useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  
  useEffect(() => {
    async function fetchTasks() {
      try {
        const fetchedTasks: [] = await invoke('get_tasks');
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks(); // Call the async function to fetch tasks
  }, []);

  console.log(tasks);
  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <div className='ml-auto flex items-center space-x-4'>
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={tasks} columns={columns} />
        </div>
      </Layout.Body>
    </Layout>
  )
}
