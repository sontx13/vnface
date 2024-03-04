import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IVote } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteVote } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchVote } from "@/redux/slice/voteSlide";
import Access from "@/components/share/access";
import { ALL_PERMISSIONS } from "@/config/permissions";
import ViewDetailVote from "@/components/admin/vote/view.vote";

const VotePage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.vote.isFetching);
    const meta = useAppSelector(state => state.vote.meta);
    const votes = useAppSelector(state => state.vote.result);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [dataInit, setDataInit] = useState<IVote | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const handleDeleteVote = async (_id: string | undefined) => {
        if (_id) {
            const res = await callDeleteVote(_id);
            if (res && res.data) {
                message.success('Xóa Vote thành công');
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

    const columns: ProColumns<IVote>[] = [
        {
            title: 'STT',
            key: 'index',
            width: 50,
            align: "center",
            render: (text, record, index, action) => {
                return (
                    <a href="#" onClick={() => {
                        setOpenViewDetail(true);
                        setDataInit(record);
                    }}>
                        {record._id}
                    </a>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            sorter: true,
           
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            render(dom, entity, index, action, schema) {
                {if (entity.status =="PENDING") {
                    return <>
                        <Tag color={"blue" } >{"PENDING"}</Tag>
                    </>
                }else if(entity.status =="REVIEWING"){
                    return <>
                        <Tag color={"lime" } >{"REVIEWING"}</Tag>
                    </>
                }else if(entity.status =="APPROVED"){
                    return <>
                        <Tag color={"yellow" } >{"APPROVED"}</Tag>
                    </>
                }else {
                    return <>
                        <Tag color={"red" } >{"REJECTED"}</Tag>
                    </>
                }
                }
               
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
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
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
                    {/* <Access
                        permission={ALL_PERMISSIONS.JOBS.UPDATE}
                        hideChildren
                    >
                        <EditOutlined
                            style={{
                                fontSize: 20,
                                color: '#ffa500',
                            }}
                            type=""
                            onClick={() => {
                                navigate(`/admin/vote/upsert?id=${entity._id}`)
                            }}
                        />
                    </Access> */}
                    <Access
                        permission={ALL_PERMISSIONS.JOBS.DELETE}
                        hideChildren
                    >
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa vote"}
                            description={"Bạn có chắc chắn muốn xóa vote này ?"}
                            onConfirm={() => handleDeleteVote(entity._id)}
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
                    </Access>
                     <ViewDetailVote
                        open={openViewDetail}
                        onClose={setOpenViewDetail}
                        dataInit={dataInit}
                        setDataInit={setDataInit}
                        reloadTable={reloadTable}
                    />
                </Space>
            ),

        },
    ];

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };
        if (clone.name) clone.name = `/${clone.name}/i`;
        if (clone.salary) clone.salary = `/${clone.salary}/i`;
        if (clone?.level?.length) {
            clone.level = clone.level.join(",");
        }

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.name) {
            sortBy = sort.name === 'ascend' ? "sort=name" : "sort=-name";
        }
        if (sort && sort.salary) {
            sortBy = sort.salary === 'ascend' ? "sort=salary" : "sort=-salary";
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
                permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}
            >
                <DataTable<IVote>
                    actionRef={tableRef}
                    headerTitle="Danh sách Biểu quyết"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={votes}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchVote({ query }))
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
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={() => navigate('upsert')}
                            >
                                Thêm mới
                            </Button>
                        );
                    }}
                />
            </Access>
        </div>
    )
}

export default VotePage;