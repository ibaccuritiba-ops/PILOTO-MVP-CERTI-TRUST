import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  WhiteLabelConfig, 
  Course, 
  Certificate 
} from './types';
import { 
  INITIAL_WHITE_LABEL, 
  MOCK_USER_DIRECTOR, 
  MOCK_USER_PROFESSOR, 
  MOCK_USER_STUDENT,
  MOCK_COURSES,
  MOCK_EXAM
} from './constants';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardDirector from './components/DashboardDirector';
import DashboardProfessor from './components/DashboardProfessor';
import DashboardStudent from './components/DashboardStudent';
import CourseView from './components/CourseView';
import ExamView from './components/ExamView';
import BiometricValidation from './components/BiometricValidation';
import CertificateView from './components/CertificateView';
import WhiteLabelSettings from './components/WhiteLabelSettings';
import Login from './components/Login';
import EvaluationCreator from './components/EvaluationCreator';
import CourseEditor from './components/CourseEditor';
import StudentManagement from './components/StudentManagement';
import FacialRegistration from './components/FacialRegistration';
import StudentEvaluations from './components/StudentEvaluations';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(INITIAL_WHITE_LABEL);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [evaluations, setEvaluations] = useState<any[]>([MOCK_EXAM]);
  const [students, setStudents] = useState<User[]>([
    { ...MOCK_USER_STUDENT, status: 'ACTIVE', allowedLessons: [] }
  ]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Apply white-label colors to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--primary', whiteLabel.primaryColor);
    document.documentElement.style.setProperty('--secondary', whiteLabel.secondaryColor);
    
    // Update favicon if possible (mock)
    const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (link) link.href = whiteLabel.faviconUrl;
  }, [whiteLabel]);

  const handleLogin = (role: UserRole) => {
    if (role === 'DIRECTOR') setUser(MOCK_USER_DIRECTOR);
    else if (role === 'PROFESSOR') setUser(MOCK_USER_PROFESSOR);
    else setUser(MOCK_USER_STUDENT);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
  };

  const renderView = () => {
    if (!user) return <Login onLogin={handleLogin} />;

    // Force facial registration if not done
    if (!user.hasFacialTemplate && user.role !== 'DIRECTOR') {
      return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)]">
          <FacialRegistration 
            userName={user.name} 
            onComplete={(photo) => {
              setUser({ ...user, hasFacialTemplate: true, avatar: photo });
              // In a real app, we would save this to the backend
              alert('Registro biométrico concluído com sucesso!');
            }} 
          />
        </div>
      );
    }

    const isProfessor = user.role === 'PROFESSOR';
    const isDirector = user.role === 'DIRECTOR';
    const isStudent = user.role === 'STUDENT';

    switch (currentView) {
      case 'dashboard':
      case 'courses':
      case 'evaluations':
        if (isDirector) return <DashboardDirector />;
        if (isProfessor) return (
          <DashboardProfessor 
            courses={courses}
            evaluations={evaluations}
            students={students}
            onCreateEvaluation={() => setCurrentView('evaluation-creator')} 
            onCreateCourse={() => {
              setSelectedCourse(null);
              setCurrentView('course-editor');
            }}
            onEditCourse={(id) => {
              const course = courses.find(c => c.id === id);
              if (course) {
                setSelectedCourse(course);
                setCurrentView('course-editor');
              }
            }}
            currentView={currentView}
          />
        );
        
        // Student views for dashboard/courses/evaluations
        if (currentView === 'evaluations') {
          return (
            <StudentEvaluations 
              availableExams={evaluations}
              completedExams={[]}
              onTakeExam={(exam) => setCurrentView('biometrics')}
            />
          );
        }

        return (
          <DashboardStudent 
            user={user}
            courses={courses}
            onStartCourse={(id) => {
              const course = courses.find(c => c.id === id);
              if (course) {
                setSelectedCourse(course);
                setCurrentView('course-view');
              }
            }}
            onViewCertificate={(id) => {
              setSelectedCertificate({
                id,
                studentName: user.name,
                courseTitle: 'Compliance e Ética Corporativa',
                issueDate: '15 Jan 2024',
                validationCode: 'TR-9928-AX-2024',
                institutionName: whiteLabel.institutionName,
                logoUrl: whiteLabel.logoUrl
              });
              setCurrentView('certificate-view');
            }}
          />
        );
      
      case 'course-editor':
        return (
          <CourseEditor 
            course={selectedCourse || undefined}
            onBack={() => setCurrentView('dashboard')}
            onSave={(courseData) => {
              if (courseData.id === 'new') {
                const newCourse = { ...courseData, id: `c-${Date.now()}` };
                setCourses([...courses, newCourse]);
              } else {
                setCourses(courses.map(c => c.id === courseData.id ? courseData : c));
              }
              setCurrentView('dashboard');
              alert('Curso salvo com sucesso!');
            }}
          />
        );

      case 'evaluation-creator':
        return (
          <EvaluationCreator 
            onBack={() => setCurrentView('dashboard')}
            onSave={(evalData) => {
              const newEval = { ...evalData, id: `e-${Date.now()}` };
              setEvaluations([...evaluations, newEval]);
              setCurrentView('evaluations');
              alert('Avaliação publicada com sucesso!');
            }}
          />
        );

      case 'course-view':
        return (selectedCourse && user) ? (
          <CourseView 
            course={selectedCourse} 
            user={user}
            onBack={() => setCurrentView('dashboard')}
            onStartExam={() => setCurrentView('biometrics')}
            onUpdateCourse={(updatedCourse) => {
              setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
              setSelectedCourse(updatedCourse);
            }}
          />
        ) : null;

      case 'biometrics':
        return <BiometricValidation onValidated={() => setCurrentView('exam-view')} />;

      case 'exam-view':
        return <ExamView 
          exam={MOCK_EXAM} 
          onFinish={(score) => {
            if (score >= 70) {
              setSelectedCertificate({
                id: 'new-cert',
                studentName: user.name,
                courseTitle: MOCK_EXAM.title.replace('Avaliação Final - ', ''),
                issueDate: new Date().toLocaleDateString('pt-BR'),
                validationCode: `TR-${Math.floor(Math.random() * 9000) + 1000}-AX-2024`,
                institutionName: whiteLabel.institutionName,
                logoUrl: whiteLabel.logoUrl
              });
              setCurrentView('certificate-view');
            } else {
              setCurrentView('dashboard');
              alert(`Você obteve ${score}%. A nota mínima para aprovação é 70%.`);
            }
          }} 
        />;

      case 'certificate-view':
        return selectedCertificate ? (
          <CertificateView 
            certificate={selectedCertificate} 
            onBack={() => setCurrentView('dashboard')} 
          />
        ) : null;

      case 'settings':
        return <WhiteLabelSettings config={whiteLabel} onUpdate={setWhiteLabel} />;

      case 'users':
        return (
          <StudentManagement 
            students={students}
            courses={courses}
            onAddStudent={(newStudent) => {
              const student: User = {
                ...newStudent as User,
                id: `s-${Date.now()}`,
                avatar: `https://i.pravatar.cc/150?u=${Date.now()}`
              };
              setStudents([...students, student]);
              alert('Aluno cadastrado com sucesso!');
            }}
            onUpdateStudent={(updatedStudent) => {
              setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
            }}
            onDeleteStudent={(id) => {
              if (confirm('Tem certeza que deseja excluir este aluno?')) {
                setStudents(students.filter(s => s.id !== id));
              }
            }}
          />
        );

      case 'login':
        handleLogout();
        return null;

      default:
        return <div className="p-8 text-slate-500">Funcionalidade em desenvolvimento...</div>;
    }
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const isFullWidthView = ['course-view', 'exam-view'].includes(currentView);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {!isFullWidthView && (
        <Sidebar 
          role={user.role} 
          currentView={currentView} 
          onViewChange={setCurrentView}
          primaryColor={whiteLabel.primaryColor}
        />
      )}
      
      <div className={`flex-1 flex flex-col ${!isFullWidthView ? 'ml-64' : ''}`}>
        {!isFullWidthView && (
          <Topbar user={user} institutionName={whiteLabel.institutionName} />
        )}
        
        <main className={`flex-1 ${!isFullWidthView ? 'mt-16 p-8' : ''}`}>
          {renderView()}
        </main>
      </div>
    </div>
  );
}
