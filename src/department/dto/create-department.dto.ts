export class CreateDepartmentDto {
    name: { [key: string]: string };
    icon?:string;
    organizationId: number;
}
