import { getOuraClient, getDateRange } from '@/lib/oura-client'

export default async function ActivityPage() {
  const client = getOuraClient()
  const { startDate, endDate } = getDateRange(30)
  const activityData = await client.getActivityData(startDate, endDate)
  
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Activity Dashboard
        </h1>
        <p className="text-gray-600">
          Live activity data from Oura API
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Activity Score</h3>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round(activityData.reduce((sum, day) => sum + day.score, 0) / activityData.length)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Steps</h3>
          <p className="text-3xl font-bold text-green-600">
            {activityData.reduce((sum, day) => sum + day.steps, 0).toLocaleString()}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Days</h3>
          <p className="text-3xl font-bold text-purple-600">
            {activityData.length}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Score</th>
                <th className="text-left p-2">Steps</th>
                <th className="text-left p-2">Active Calories</th>
                <th className="text-left p-2">Distance (m)</th>
              </tr>
            </thead>
            <tbody>
              {activityData.slice(-10).reverse().map((day) => (
                <tr key={day.day} className="border-b hover:bg-gray-50">
                  <td className="p-2">{new Date(day.day).toLocaleDateString()}</td>
                  <td className="p-2 font-semibold">{day.score}</td>
                  <td className="p-2">{day.steps.toLocaleString()}</td>
                  <td className="p-2">{day.active_calories}</td>
                  <td className="p-2">{day.equivalent_walking_distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}