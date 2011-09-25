namespace OrgServices.Models {
    public class EmpRecord {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string SupervisorId { get; set; }
        public string Office { get; set; }

        public bool HasSupervisor() {
            return SupervisorId != null;
        }
    }
}