<template>
  <div class="courses-container">
    <div class="actions">
      <input type="text" v-model="searchQuery" placeholder="Buscar curso..." class="search-input" />
      <button @click="openCreateModal" class="btn btn-success new-course-btn">
        <i class="fas fa-plus"></i> Nuevo Curso
      </button>
    </div>
    <div class="courses-grid">
      <div v-for="course in paginatedCourses" :key="course.id" class="course-card">
        <div class="card-content">
          <div class="course-info">
            <h3>{{ course.name }}</h3>
            <p>Capacidad Máxima: {{ course.maxCapacity }}</p>
            <p>Estudiantes Inscritos: {{ course.totalStudents }}</p>
          </div>
          <div class="card-actions">
            <button @click="viewStudents(course.id)" class="icon-btn btn-info">
              <i class="fas fa-users"></i>
            </button>
            <button @click="openEditModal(course)" class="icon-btn btn-primary">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(course)" class="icon-btn btn-danger">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!--confirm modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <p>¿Está seguro de que desea eliminar este curso?</p>
        <button @click="deleteCourse(confirmedCourseId)" class="btn btn-danger">Eliminar</button>
        <button @click="showModal = false" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>

    <!--edit modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Editar Curso</h3>
        <form @submit.prevent="updateCourse">
          <div class="form-group">
            <label for="courseName">Nombre del Curso</label>
            <input type="text" id="courseName" v-model="editCourseData.name" required />
          </div>
          <div class="form-group">
            <label for="courseCapacity">Capacidad Máxima</label>
            <input type="number" id="courseCapacity" v-model="editCourseData.maxCapacity" required min="1" />
          </div>
          <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancelar</button>
        </form>
      </div>
    </div>

    <!--create modal -->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <h3>Crear Nuevo Curso</h3>
        <form @submit.prevent="createCourse">
          <div class="form-group">
            <label for="newCourseName">Nombre del Curso</label>
            <input type="text" id="newCourseName" v-model="newCourseData.name" required />
          </div>
          <div class="form-group">
            <label for="newCourseCapacity">Capacidad Máxima</label>
            <input type="number" id="newCourseCapacity" v-model="newCourseData.maxCapacity" required min="1" />
          </div>
          <button type="submit" class="btn btn-primary">Crear Curso</button>
          <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancelar</button>
        </form>
      </div>
    </div>

    <!--students modal -->
    <div v-if="showStudentsModal" class="modal">
      <div class="modal-content">
        <h3>Estudiantes del Curso</h3>
        <table class="students-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Edad</th>
              <th>Género</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in students" :key="student.id">
              <td>{{ student.name }}</td>
              <td>{{ student.age }}</td>
              <td>{{ student.gender }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="showStudentsModal = false" class="btn btn-secondary">Cerrar</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToast } from 'vue-toastification';
const apiUrl = process.env.VUE_APP_API_URL;

export default {
  data() {
    return {
      courses: [], 
      searchQuery: '', 
      currentPage: 1, 
      itemsPerPage: 9, 
      showModal: false, 
      showEditModal: false, 
      showCreateModal: false, 
      showStudentsModal: false, 
      confirmedCourseId: null, 
      editCourseData: { id: null, name: '', maxCapacity: 0 }, 
      newCourseData: { name: '', maxCapacity: 0 }, 
      students: [], 
    };
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => 
        course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedCourses() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredCourses.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    }
  },
  methods: {
    //get courses
    fetchCourses() {
      axios
        .get(`${apiUrl}/course`)
        .then((response) => {
          this.courses = response.data;
        })
        .catch((error) => {
          console.error("Error al obtener cursos:", error);
        });
    },
    createCourse() {
      if (this.newCourseData.maxCapacity <= 0) {
        const toast = useToast();
        toast.error('La capacidad máxima debe ser mayor que 0');
        return;
      }
      axios
        .post(`${apiUrl}/course`, this.newCourseData)
        .then((response) => {
          this.courses.push(response.data);
          this.showCreateModal = false;
          this.newCourseData = { name: '', maxCapacity: 0 };
          const toast = useToast();
          toast.success('Curso creado exitosamente');
        })
        .catch((error) => {
          console.error("Error al crear curso:", error);
          const toast = useToast();
          toast.error('Error al crear curso');
        });
    },
    openCreateModal() {
      this.showCreateModal = true;
    },
    openEditModal(course) {
      this.editCourseData = { ...course };
      this.showEditModal = true;
    },
    updateCourse() {
      if (this.editCourseData.maxCapacity <= 0) {
        const toast = useToast();
        toast.error('La capacidad máxima debe ser mayor que 0');
        return;
      }
      axios
        .put(`${apiUrl}/course/${this.editCourseData.id}`, this.editCourseData)
        .then(() => {
          const index = this.courses.findIndex(course => course.id === this.editCourseData.id);
          if (index !== -1) {
            this.courses.splice(index, 1, this.editCourseData);
          }
          this.showEditModal = false;
          const toast = useToast();
          toast.success('Curso actualizado exitosamente');
        })
        .catch((error) => {
          console.error("Error al actualizar curso:", error);
          const toast = useToast();
          toast.error('Error al actualizar curso');
        });
    },
    confirmDelete(course) {
      if (course.totalStudents > 0) {
        const toast = useToast();
        toast.error('No se puede eliminar el curso porque tiene estudiantes inscritos.');
      } else {
        this.confirmedCourseId = course.id;
        this.showModal = true;
      }
    },
    deleteCourse(courseId) {
      axios
        .delete(`${apiUrl}/course/${courseId}`)
        .then(() => {
          this.courses = this.courses.filter(course => course.id !== courseId);
          this.showModal = false;
          const toast = useToast();
          toast.success('Curso eliminado exitosamente');
        })
        .catch((error) => {
          console.error("Error al eliminar curso:", error);
          const toast = useToast();
          toast.error('Error al eliminar curso');
        });
    },
    viewStudents(courseId) {
      axios
        .get(`${apiUrl}/course/${courseId}/students`)
        .then((response) => {
          this.students = response.data;
          this.showStudentsModal = true;
        })
        .catch((error) => {
          console.error("Error al obtener estudiantes:", error);
          const toast = useToast();
          toast.error('Error al obtener estudiantes');
        });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  created() {
    this.fetchCourses(); 
  },
};
</script>

<style scoped>
.courses-container {
  margin-left: 50px; 
  padding: 20px;
  border-radius: 8px;
  margin-top: 100px;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  width: 200px;
}

.new-course-btn {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.new-course-btn:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 20px;
  align-items: start; 
}

.course-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  min-height: 200px; 
  display: flex;
  flex-direction: column; 
  justify-content: space-between; 
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.course-info h3 {
  margin: 0 0 5px 0;
  font-size: 1.2rem;
  color: #333;
}

.course-info p {
  margin: 2px 0;
  font-size: 0.9rem;
  color: #666;
}

/*buttons */
.card-actions {
  justify-content: center;
  display: flex;
  margin-top: 40px;
  gap: 40px;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.icon-btn i {
  font-size: 1.2rem;
  color: #fff;
}

.icon-btn:hover {
  transform: scale(1.1);
}

.btn-info {
  background-color: #17a2b8;
}

.btn-primary {
  background-color: #007bff;
}

.btn-danger {
  background-color: #dc3545;
}


.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}


@media (max-width: 1200px) {
  .course-card {
    width: calc(33.333% - 20px); 
  }
}

@media (max-width: 992px) {
  .course-card {
    width: calc(50% - 20px); 
  }
}

@media (max-width: 768px) {
  .courses-container {
    margin-left: 0;
    padding: 10px;
  }

  .course-card {
    width: calc(50% - 20px); 
  }

  .table th, .table td {
    padding: 10px;
  }

  button {
    padding: 5px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .course-card {
    width: 100%; 
  }
}


.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
  position: relative;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  cursor: pointer;
}

.btn {
  margin: 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.btn:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
}


.students-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.students-table th, .students-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.students-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.students-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.students-table tr:hover {
  background-color: #f1f1f1;
}
</style>