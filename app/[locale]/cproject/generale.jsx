'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { FaBuilding, FaUsers } from 'react-icons/fa';
import { MdApartment, MdOnlinePrediction } from 'react-icons/md';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

function getGlobalDateRange(projects) {
  const allDates = [
    ...new Set(
      projects
        .filter(p => p.created_at)
        .map(p => p.created_at.slice(0, 10))
    ),
  ].sort((a, b) => {
    const da = new Date(a + 'T00:00:00');
    const db = new Date(b + 'T00:00:00');
    return da - db;
  });
  return allDates;
}

export default function Generale() {
  const supabase = createClient();
  const [projects, setProjects] = useState([]);
  const [projectStats, setProjectStats] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erreur utilisateur", userError);
        return;
      }

      // StatCard : project_edit_count
      const { data, error } = await supabase
        .from('project_edit_count')
        .select('project_id, name, online, edit_count, apart_count')
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur de chargement des projets :', error);
      } else {
        setProjects(data);
      }

      // Graph : project
      const { data: projectData, error: projectError } = await supabase
        .from('projectlist')
        .select('id, ide, created_at');

      if (projectError) {
        console.error('Erreur de chargement des projets :', projectError);
        return;
      }

      setProjectStats(projectData);
      console.log("projectData:", projectData);
    }

    fetchData();
  }, [supabase]);

  function StatCard({ label, value }) {
    return (
      <div className="bg-white shadow rounded p-4 text-center">
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-xs text-gray-500 uppercase mt-1">{label}</div>
      </div>
    );
  }

  function generateChartData(project, allProjects, uniqueDates) {
    const labels = [];
    const dataPoints = [];

    for (let i = 0; i < uniqueDates.length; i++) {
      const current = uniqueDates[i];
      const [year, month, day] = current.split('-');
      labels.push(`${day}/${month}/${year}`);

      const count = allProjects.filter(p =>
        p.ide === project.ide &&
        p.created_at.slice(0, 10) === current
      ).length;

      dataPoints.push(count);
    }

    console.log('generateChartData', { ide: project.ide, uniqueDates, dataPoints });

    return {
      labels,
      datasets: [
        {
          label: 'Appartements',
          data: dataPoints,
          borderColor: 'rgba(75,192,192,1)',
          backgroundColor: function (context) {
            const chart = context.chart;
            const {ctx, chartArea} = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(75,192,192,0.3)');
            gradient.addColorStop(1, 'rgba(75,192,192,0)');
            return gradient;
          },
          tension: 0.3,
        },
      ],
    };
  }

  return (
    <div className="p-6 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-700 mb-4">
        Vue d’ensemble des projets
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Projets" value={projects.length} />
        <StatCard label="En ligne" value={projects.filter(p => p.online).length} />
        <StatCard label="Collaborateurs" value={projects.reduce((sum, p) => sum + p.edit_count, 0)} />
        <StatCard label="Appartements" value={projects.reduce((sum, p) => sum + p.apart_count, 0)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...new Set(projectStats.map(p => p.ide))].map((ide) => {
          const projectGroup = projectStats.filter(p => p.ide === ide);
          // Récupérer le nom du projet depuis projects
          const matchingProject = projects.find(p => p.project_id === ide);
          const projectName = matchingProject?.name || `Projet ${ide}`;
          const uniqueDates = getGlobalDateRange(projectGroup);
          const chartData = generateChartData({ ide }, projectStats, uniqueDates);
          const chartOptions = {
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                  callback: function (value) {
                    return Number.isInteger(value) ? value : null;
                  }
                }
              }
            }
          };

          return (
            <Card key={ide}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FaBuilding className="text-muted-foreground" /> {projectName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={chartData} options={chartOptions} />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}