import React, { useEffect, useState } from "react";
import {
 Card,
 CardContent,
 Typography
} from "@mui/material";

import {
 ResponsiveContainer,
 AreaChart,
 Area,
 XAxis,
 YAxis,
 Tooltip
} from "recharts";

import api from "../../services/api";

const SalesChart = () => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesTrend = async () => {
      try {
        const response = await api.get("/sales");
        const sales = response.data || [];
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ];

        const aggregated = sales.reduce((acc, sale) => {
          const createdAt = sale.createdAt || sale.date || null;
          const date = createdAt ? new Date(createdAt) : null;

          if (!date || Number.isNaN(date.getTime())) return acc;

          const monthLabel = monthNames[date.getMonth()];
          acc[monthLabel] = (acc[monthLabel] || 0) + Number(sale.total || 0);
          return acc;
        }, {});

        const sortedTrend = monthNames.map((month) => ({
          month,
          sales: Math.round((aggregated[month] || 0) * 100) / 100
        }));

        setTrendData(sortedTrend);
      } catch (error) {
        console.error("Failed to load Dynamics sales trend:", error);
        setTrendData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesTrend();
  }, []);

  const chartData = trendData.length ? trendData : [{ month: "No Data", sales: 0 }];

 return (
   <Card>
     <CardContent>

       <Typography
         variant="h6"
         gutterBottom
       >
         Sales from Dynamics 365
       </Typography>

       <ResponsiveContainer
         width="100%"
         height={300}
       >
         <AreaChart
           data={chartData}
         >
           <XAxis dataKey="month" />
           <YAxis />
           <Tooltip />
           <Area
             type="monotone"
             dataKey="sales"
           />
         </AreaChart>
       </ResponsiveContainer>

     </CardContent>
   </Card>
 );
};

export default SalesChart;