<template>
  <div class="statistics-container">
    <div class="charts">

      <div class="chart" v-if="statistics">
        <h3>Resumen de Estadísticas</h3>
        <div class="summary-cards">
          <div class="summary-card total-courses">
            <h4>Total de Cursos</h4>
            <p>{{ statistics.totalCourses }}</p>
          </div>
          <div class="summary-card total-students">
            <h4>Total de Alumnos</h4>
            <p>{{ statistics.totalStudents }}</p>
          </div>
          <div class="summary-card average-students">
            <h4>Promedio de Alumnos por Curso</h4>
            <p>{{ roundNumber(statistics.averageStudentsPerCourse) }}</p>
          </div>
          <div class="summary-card average-capacity">
            <h4>Promedio de Capacidad por Curso</h4>
            <p>{{ roundNumber(statistics.averageCapacityPerCourse) }}</p>
          </div>
        </div>
      </div>
     
      <div class="chart" v-show="statistics && statistics.courseCapacityPercentage">
        <h3>Porcentaje de Capacidad de Cursos</h3>
        <div id="capacityChart"></div>
      </div>
      
      <div class="chart" v-show="statistics && statistics.studentsByGender">
        <h3>Alumnos por Género</h3>
        <div id="genderChart"></div>
      </div>
      
      <div class="chart" v-show="statistics && statistics.studentsByCourse">
        <h3>Alumnos por Curso</h3>
        <div id="studentsByCourseChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as d3 from "d3";
import { useToast } from 'vue-toastification';


export default {
  data() {
    return {
      statistics: null,
    };
  },
  methods: {
    fetchData() {
      axios
        .get("http://localhost:8080/stadistics")
        .then((response) => {
          this.statistics = response.data;
          this.createCharts();
        })
        .catch((error) => {
          const toast = useToast();
          toast.error('Error al obtener estadísticas', error);
        });
    },
    
    roundNumber(value) {
      return Math.round(value * 100) / 100; 
    },

    //graphs
    createCharts() {
      if (this.statistics) {
        //percent graph
        const courseData = this.statistics.courseCapacityPercentage;
        const capacityData = courseData.map((d) => d.capacityPercentage);
        const courseNames = courseData.map((d) => d.courseName);

        this.createBarChart("#capacityChart", courseNames, capacityData, "Porcentaje de Capacidad (%)", true);

        //students by gen graph
        const genderData = [
          { label: "Femenino", value: this.statistics.studentsByGender.F },
          { label: "Masculino", value: this.statistics.studentsByGender.M },
        ];
        this.createPieChart("#genderChart", genderData, true);

        // students by course graph
        const studentsByCourseData = Object.entries(this.statistics.studentsByCourse).map(([key, value]) => ({
          label: key,
          value,
        }));
        this.createLineChart(
          "#studentsByCourseChart",
          studentsByCourseData.map((d) => d.label),
          studentsByCourseData.map((d) => d.value),
          "Número de Alumnos",
          true
        );
      }
    },
    //bars graph
    createBarChart(selector, labels, data, yLabel, animate = false) {
      const width = 600; 
      const height = 400; 
      const margin = { top: 20, right: 30, bottom: 100, left: 50 };

      const svg = d3
        .select(selector)
        .html("") 
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const x = d3.scaleBand().domain(labels).range([margin.left, width - margin.right]).padding(0.1);
      const y = d3.scaleLinear().domain([0, d3.max(data)]).nice().range([height - margin.bottom, margin.top]);

      const color = d3.scaleOrdinal(d3.schemeCategory10); 

      const bars = svg
        .append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d, i) => x(labels[i]))
        .attr("y", (d) => y(animate ? 0 : d))
        .attr("height", (d) => y(0) - y(animate ? 0 : d))
        .attr("width", x.bandwidth())
        .attr("fill", (d, i) => color(i));

      if (animate) {
        bars.transition()
          .duration(1000)
          .attr("y", (d) => y(d))
          .attr("height", (d) => y(0) - y(d));
      }

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)") 
        .style("text-anchor", "end"); 

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 20) 
        .text("Cursos");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${margin.left / 2},${height / 2}) rotate(-90)`)
        .text(yLabel);
    },

    //line graph
    createLineChart(selector, labels, data, yLabel, animate = false) {
      const width = 600; 
      const height = 400; 
      const margin = { top: 20, right: 30, bottom: 100, left: 50 }; 

      const svg = d3
        .select(selector)
        .html("") 
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      const x = d3.scalePoint().domain(labels).range([margin.left, width - margin.right]);
      const y = d3.scaleLinear().domain([0, d3.max(data)]).nice().range([height - margin.bottom, margin.top]);

      const line = d3.line()
        .x((d, i) => x(labels[i]))
        .y((d) => y(d));

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)") 
        .style("text-anchor", "end"); 

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      if (animate) {
        const totalLength = path.node().getTotalLength();
        path
          .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);
      }

      svg
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d, i) => x(labels[i]))
        .attr("cy", (d) => y(d))
        .attr("r", 5)
        .attr("fill", "steelblue")
        .attr("opacity", 0)
        .transition()
        .duration(2000)
        .attr("opacity", 1);

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - 20)
        .text("Cursos");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${margin.left / 2},${height / 2}) rotate(-90)`)
        .text(yLabel);
    },

    //pie chart
    createPieChart(selector, data, animate = false) {
      const width = 400;
      const height = 300;
      const radius = Math.min(width, height) / 2;

      const svg = d3
        .select(selector)
        .html("") 
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);
      const pie = d3.pie().value((d) => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);

      const paths = svg
        .selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.label));

      if (animate) {
        paths.transition()
          .duration(1000)
          .attrTween("d", function(d) {
            const i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
            return function(t) {
              d.endAngle = i(t);
              return arc(d);
            };
          });
      }

      svg
        .selectAll("text")
        .data(pie(data))
        .join("text")
        .attr("transform", (d) => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .text((d) => `${d.data.label}: ${d.data.value}`);
    },
  },
  //fetch data when component is created
  created() {
    this.fetchData(); 
  },
};
</script>

<style scoped>
.statistics-container {
  padding: 20px;
  border-radius: 8px;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 80px;
}

.chart, .summary-chart {
  flex: 1 1 400px;
  max-width: 600px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.summary-card {
  flex: 1 1 150px;
  background-color: #fff;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.summary-card.total-courses {
  background-color: #e0f7fa;
}

.summary-card.total-students {
  background-color: #ffe0b2;
}

.summary-card.average-students {
  background-color: #e1bee7;
}

.summary-card.average-capacity {
  background-color: #c8e6c9;
}

h2, h3, h4 {
  color: #333;
  text-align: center;
}

p {
  font-size: 1.5em;
  margin: 0;
}


@media (max-width: 768px) {
  .chart, .summary-chart {
    flex: 1 1 100%;
  }
  .summary-card {
    flex: 1 1 100%;
  }
}
</style>