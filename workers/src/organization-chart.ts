import { Employee, getEmployees, postEmployees } from './kv/employees';
import Papa from 'papaparse';

interface RequestBody {
	organizationData: string;
}

interface EmployeeCsv {
	name: string;
	department: string;
	salary: number;
	office: string;
	isManager: boolean;
	skill1: string;
	skill2: string;
	skill3: string;
}

interface Department {
	name: string;
	managerName: string;
	employees: Employee[];
}

const getDepartments = (employees: Employee[]) => {
	const departments: { [key: string]: Department } = {};
	for (const employee of employees) {
		const { name, department, isManager } = employee;
		if (!(department in departments)) {
			departments[department] = {
				name: department,
				managerName: '',
				employees: [],
			};
		}
		if (isManager === true) {
			departments[department].managerName = name;
		}
		departments[department].employees.push(employee);
	}
	return Object.values(departments);
};

const getOrganizationChart = async (request: Request, kvStore: KVNamespace): Promise<Response> => {
	const employees = await getEmployees(kvStore);
	const responseData = { organization: { departments: getDepartments(employees) } };
	return new Response(JSON.stringify(responseData), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

const parseEmployees = (csvStr: string): Employee[] => {
	const value = Papa.parse<EmployeeCsv>(csvStr, {
		header: true,
		dynamicTyping: true,
	});
	const employees = value.data;
	return employees.map((employee) => {
		const skills = [employee.skill1, employee.skill2, employee.skill3];
		delete employee.skill1;
		delete employee.skill2;
		delete employee.skill3;
		employee.skills = skills;
		return employee;
	}) as Employee[];
};

const postOrganizationChart = async (request: Request, kvStore: KVNamespace): Promise<Response> => {
	try {
		const requestBody = (await request.json()) as Partial<RequestBody>;
		if (typeof requestBody.organizationData !== 'string') {
			return new Response('Bad Request', { status: 400 });
		}
		const csvStr = requestBody.organizationData;
		const employees = parseEmployees(csvStr);
		await postEmployees(employees, kvStore);
		return new Response('Success!', { status: 200 });
	} catch (error) {
		return new Response('Bad Request', { status: 400 });
	}
};

export { getOrganizationChart, postOrganizationChart };
