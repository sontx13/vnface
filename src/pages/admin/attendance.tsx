import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IAttendance } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteDiemdanh } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchAttendance } from "@/redux/slice/attendanceSlide";
import ViewDetailAttendance from "@/components/admin/attendance/view.attendance";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";

const AttendancePage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.attendance.isFetching);
    const meta = useAppSelector(state => state.attendance.meta);
    const attendances = useAppSelector(state => state.attendance.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IAttendance | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const handleDeleteAttendance = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteDiemdanh(_id);
            if (res && res.data) {
                message.success('Xóa Attendance thành công');
                reloadTable();
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IAttendance>[] = [
        // {
        //     title: 'Id',
        //     dataIndex: '_id',
        //     width: 250,
        //     render: (text, record, index, action) => {
        //         return (
        //             <a href="#" onClick={() => {
        //                 setOpenViewDetail(true);
        //                 setDataInit(record);
        //             }}>
        //                 {record._id}
        //             </a>
        //         )
        //     },
        //     hideInSearch: true,
        // },
        {
            title: 'Tên zalo',
            dataIndex: 'name',
        }
        ,
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            render(dom, entity, index, action, schema) {
                return <>
                    <Tag color={entity.isActive ? "lime" : "red"} >
                        {entity.isActive ? "Đã điểm danh" : "Chưa điểm danh"}
                    </Tag>
                </>
            },
            hideInSearch: true,
        },
         {
            title: 'Latitude',
            dataIndex: "latitude",
            hideInSearch: true,
        },
       
        {
            title: 'Longitude',
            dataIndex: "longitude",
            hideInSearch: true,
        },
        {
            title: 'Thời gian gửi',
            dataIndex: 'timestamp',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.timestamp).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        {
           title: 'Cuộc họp',
            dataIndex: ["jobId", "name"],
            hideInSearch: true,
        },
        {
            title: 'Đơn vị',
            dataIndex: ["companyId", "name"],
            hideInSearch: true,
        },

        // {
        //     title: 'Ngày tạo',
        //     dataIndex: 'createdAt',
        //     width: 200,
        //     sorter: true,
        //     render: (text, record, index, action) => {
        //         return (
        //             <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
        //         )
        //     },
        //     hideInSearch: true,
        // },
        // {
        //     title: 'Ngày sửa',
        //     dataIndex: 'updatedAt',
        //     width: 200,
        //     sorter: true,
        //     render: (text, record, index, action) => {
        //         return (
        //             <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
        //         )
        //     },
        //     hideInSearch: true,
        // },
        {

            title: 'Actions',
            hideInSearch: true,
            width: 50,
            render: (_value, entity, _index, _action) => (
                <Space>
                    {/* <EditOutlined
                        style={{
                            fontSize: 20,
                            color: '#ffa500',
                        }}
                        type=""
                        onClick={() => {
                            navigate(`/admin/job/upsert?id=${entity._id}`)
                        }}
                    /> */}

                    <Popconfirm
                        placement="leftTop"
                        title={"Xác nhận xóa attendance"}
                        description={"Bạn có chắc chắn muốn xóa attendance này ?"}
                        onConfirm={() => handleDeleteAttendance(entity._id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer", margin: "0 10px" }}>
                            <DeleteOutlined
                                style={{
                                    fontSize: 20,
                                    color: '#ff4d4f',
                                }}
                            />
                        </span>
                    </Popconfirm>
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        // if (clone.name) clone.name = `/${clone.name}/i`;
        // if (clone.salary) clone.salary = `/${clone.salary}/i`;
        if (clone?.status?.length) {
            clone.status = clone.status.join(",");
        }

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=status" : "sort=-status";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt" : "sort=-createdAt";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt" : "sort=-updatedAt";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=-updatedAt`;
        } else {
            temp = `${temp}&${sortBy}`;
        }

        temp += "&populate=companyId,jobId&fields=companyId._id, companyId.name, companyId.logo, jobId._id, jobId.name";
        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <DataTable<IAttendance>
                    actionRef={tableRef}
                    headerTitle="Danh sách Điểm danh"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={attendances}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchAttendance({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.current,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <></>
                        );
                    }}
                />
            </Access>
            <ViewDetailAttendance
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default AttendancePage;