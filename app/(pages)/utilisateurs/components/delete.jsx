import { useState } from 'react'
import { createClient } from "@/utils/supabase/client"; 
import { FaRegTrashAlt } from "react-icons/fa";

const supabase = createClient();

export default function DeleteButton({ user }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('test')
      .delete()
      .eq('id', user?. id)
    

    if (error) {
      console.log('Error deleting data:', error.message)
    } else {
      console.log('Data deleted successfully!')
    }

    setLoading(false)
  }

  return (
    <button onClick={handleDelete} className='hover:bg-red-200 p-2 rounded-full'>
    <FaRegTrashAlt color='red' />
    </button>
  )
}