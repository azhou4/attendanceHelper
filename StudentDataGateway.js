class StudentDataGateway {

    var students;
    var absences;

    constructor (){
        this.setStudentDummyData();
        this.setAttendanceDummyData();
    }

    setStudentDummyData(){
        this.students = [
            {
                name: "Amy",
                id: 1,
                parentEmail: "amy@gmail.com",
                parentPhoneNumber: "12345",
            },
            {
                name: "Elena",
                id: 2,
                parentEmail: "elena@gmail.com",
                parentPhoneNumber: "54321",
                attendance: {}
            },
            {
                name: "Jenny",
                id: 3,
                parentEmail: "jenny@gmail.com",
                parentPhoneNumber: "6789",
                attendance: {}
            },
            {
                name: "Laurel",
                id: 4,
                parentEmail: "laurel@gmail.com",
                parentPhoneNumber: "9876",
                attendance: {}
            }
        ]
    }

    setAttendanceDummyData(){
        this.absences = [
            "07/17/19": 1,
            "07/17/19": 3,
            "07/18/19": 2,
            "07/19/19": 1,
        ]
    }

    createStudent(name, id, parentEmail, parentPhoneNumber){

    }

    getStudentList() {
        return this.students;
    }

    getContactInfo(studentId){

    }

    setAttendanceStatus(student, date, status){

    }

    getAttendanceRecord(date) {

    }

}