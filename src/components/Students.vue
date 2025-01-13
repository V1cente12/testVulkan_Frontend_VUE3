<template>
  <div class="students-container">
    <div class="actions">
      <input type="text" v-model="searchQuery" placeholder="Buscar estudiante..." class="search-input" />
      <button @click="showCreateModal = true" class="btn btn-success">
        <i class="fas fa-plus"></i> Nuevo Estudiante
      </button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Género</th>
          <th>Curso</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(student, index) in paginatedStudents" :key="student.id">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ student.name }}</td>
          <td>{{ student.age }}</td>
          <td>
            {{ student.gender === 'M' ? 'Masculino' : 'Femenino' }}
          </td>
          <td>{{ student.course ? student.course.name : 'N/A' }}</td>
          <td>
            <button @click="editStudent(student.id)" class="btn btn-primary">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="confirmDelete(student.id)" class="btn btn-danger">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">
        <i class="fas fa-chevron-left"></i>
      </button>
      <span>Página {{ currentPage }} de {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!--delete modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showModal = false">&times;</span>
        <p>¿Está seguro de que desea eliminar este estudiante?</p>
        <button @click="deleteStudent(confirmedStudentId)" class="btn btn-danger">Eliminar</button>
        <button @click="showModal = false" class="btn btn-secondary">Cancelar</button>
      </div>
    </div>

    <!--edit modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showEditModal = false">&times;</span>
        <h2>Editar Estudiante</h2>
        <form @submit.prevent="updateStudent">
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input type="text" v-model="editStudentData.name" id="name" required>
          </div>
          <div class="form-group">
            <label for="age">Edad:</label>
            <input type="number" v-model="editStudentData.age" id="age" required>
          </div>
          <div class="form-group">
            <label for="gender">Género:</label>
            <select v-model="editStudentData.gender" id="gender" required>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div class="form-group">
            <label for="course">Curso:</label>
            <select v-model="editStudentData.course.id" id="course" required>
              <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.name }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancelar</button>
        </form>
      </div>
    </div>

    <!--create modal-->
    <div v-if="showCreateModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showCreateModal = false">&times;</span>
        <h2>Nuevo Estudiante</h2>
        <form @submit.prevent="createStudent">
          <div class="form-group">
            <label for="newName">Nombre:</label>
            <input type="text" v-model="newStudentData.name" id="newName" required>
          </div>
          <div class="form-group">
            <label for="newAge">Edad:</label>
            <input type="number" v-model="newStudentData.age" id="newAge" required>
          </div>
          <div class="form-group">
            <label for="newGender">Género:</label>
            <select v-model="newStudentData.gender" id="newGender" required>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
          <div class="form-group">
            <label for="newCourse">Curso:</label>
            <select v-model="newStudentData.course.id" id="newCourse" required>
              <option v-for="course in courses" :key="course.id" :value="course.id">{{ course.name }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancelar</button>
        </form>
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
      students: [], 
      courses: [], 
      searchQuery: '', 
      currentPage: 1, 
      itemsPerPage: 10, 
      showModal: false, 
      showEditModal: false, 
      showCreateModal: false, 
      confirmedStudentId: null, 
      editStudentData: { 
        id: null,
        name: '',
        age: '',
        gender: '',
        course: {
          id: null
        }
      },
      newStudentData: { 
        name: '',
        age: '',
        gender: '',
        course: {
          id: null
        }
      }
    };
  },
  computed: {
    filteredStudents() {
      return this.students.filter(student => 
        student.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedStudents() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredStudents.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredStudents.length / this.itemsPerPage);
    }
  },
  methods: {
    fetchStudents() {
      axios
        .get(`${apiUrl}/student`)
        .then((response) => {
          this.students = response.data;
        })
        .catch((error) => {
          console.error("Error al obtener estudiantes:", error);
        });
    },
    
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
    createStudent() {
      const toast = useToast();
      axios
        .post(`${apiUrl}/student`, this.newStudentData)
        .then(() => {
          this.fetchStudents();
          this.showCreateModal = false;
          toast.success('Estudiante creado exitosamente');
        })
        .catch((error) => {
          console.error("Error al crear estudiante:", error);
          toast.error('Error al crear estudiante');
        });
    },
    editStudent(studentId) {
      axios
        .get(`${apiUrl}/student/${studentId}`)
        .then((response) => {
          this.editStudentData = response.data;
          this.showEditModal = true;
        })
        .catch((error) => {
          console.error("Error al obtener datos del estudiante:", error);
        });
    },
    updateStudent() {
      const toast = useToast();
      axios
        .put(`${apiUrl}/student/${this.editStudentData.id}`, this.editStudentData)
        .then(() => {
          this.fetchStudents();
          this.showEditModal = false;
          toast.info('Estudiante actualizado exitosamente');
        })
        .catch((error) => {
          console.error("Error al actualizar estudiante:", error);
          toast.error('Error al actualizar estudiante');
        });
    },
    confirmDelete(studentId) {
      this.confirmedStudentId = studentId;
      this.showModal = true;
    },
    deleteStudent(studentId) {
      const toast = useToast();
      axios
        .delete(`${apiUrl}/student/${studentId}`)
        .then(() => {
          this.students = this.students.filter(student => student.id !== studentId);
          this.showModal = false;
          toast.error('Estudiante eliminado exitosamente');
        })
        .catch((error) => {
          console.error("Error al eliminar estudiante:", error);
          toast.error('Error al eliminar estudiante');
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
    this.fetchStudents(); 
    this.fetchCourses(); 
  },
};
</script>

<style scoped>
.students-container {
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

.table {
  width: 100%;
  margin-bottom: 20px;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.table th, .table td {
  padding: 15px;
  text-align: center;
  border: 1px solid #ddd;
}

.table th {
  background-color: #dc3545;
  color: white;
  font-weight: bold;
}

.table td {
  background-color: #f9f9f9;
}

.table tr:nth-child(even) td {
  background-color: #f1f1f1;
}

button {
  margin: 5px;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-success {
  background-color: #28a745;
  color: white;
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
  background-color: #e4e0e0;
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

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input{
  width: 80%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.form-group select {
  width: 85%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
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


@media (max-width: 768px) {
  .students-container {
    margin-left: 0;
    padding: 10px;
  }

  .table th, .table td {
    padding: 10px;
  }

  button {
    padding: 5px;
    font-size: 14px;
  }
}
</style>