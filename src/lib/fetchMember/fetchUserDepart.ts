interface Department {
  department: string;
}

export const FetchDepartMent = (departments: Department[]) => {
  return departments.map((departName) => ({
    label: departName.department,
  }));
};
