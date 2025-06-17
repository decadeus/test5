import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";



const ListCV = () => {
    const [data, setData] = useState([]);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('project')
                .select('country, city');

            if (error) {
                // console.error('Error fetching data:', error);
            } else {
                setData(data);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='bg-red-300 h-[300px]'>
            <h1>List of Countries and Cities</h1>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>
                        {item.country} - {item.city}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListCV;