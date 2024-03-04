import DataTable from "@/components/client/data-table";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { IResult } from "@/types/backend";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ProColumns, ProFormSelect } from '@ant-design/pro-components';
import { Button, Popconfirm, Select, Space, Tag, message, notification } from "antd";
import { useState, useRef } from 'react';
import dayjs from 'dayjs';
import { callDeleteResult } from "@/config/api";
import queryString from 'query-string';
import { useNavigate } from "react-router-dom";
import { fetchResult } from "@/redux/slice/resultSlide";
import ViewDetailResult from "@/components/admin/result/view.result";
import { ALL_PERMISSIONS } from "@/config/permissions";
import Access from "@/components/share/access";

const ResultPage = () => {
    const tableRef = useRef<ActionType>();

    const isFetching = useAppSelector(state => state.result.isFetching);
    const meta = useAppSelector(state => state.result.meta);
    const results = useAppSelector(state => state.result.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IResult | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    // const handleDeleteResult = async (_id: string | undefined) => {
    //     if (_id) {
    //         const res = await callDeleteResult(_id);
    //         if (res && res.data) {
    //             message.success('Xóa Result thành công');
    //             reloadTable();
    //         } else {
    //             notification.error({
    //                 message: 'Có lỗi xảy ra',
    //                 description: res.message
    //             });
    //         }
    //     }
    // }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IResult>[] = [
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
            title: 'Tên Zalo',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Số đt',
            dataIndex: 'phone',
            sorter: true,
        },

        {
           title: 'Biểu quyết',
            dataIndex: ["voteId", "question"],
            hideInSearch: true,
        },
        {
            title: 'Câu trả lời',
            dataIndex: 'answer',
            render(dom, entity, index, action, schema) {
                {if (entity.answer =="yes") {
                    return <>
                        <Tag color={"blue" } >{"Đồng ý"}</Tag>
                    </>
                }else if(entity.answer =="no"){
                    return <>
                        <Tag color={"red" } >{"Không đồng ý"}</Tag>
                    </>
                }else {
                    return <>
                        <Tag color={"lime" } >{"Không chọn"}</Tag>
                    </>
                }
                }
               
            },
            sorter: true,
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
        {
            title: 'Ngày sửa',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss')}</>
                )
            },
            hideInSearch: true,
        },
        // {

        //     title: 'Actions',
        //     hideInSearch: true,
        //     width: 50,
        //     render: (_value, entity, _index, _action) => (
        //         <Space>
        //             <EditOutlined
        //                 style={{
        //                     fontSize: 20,
        //                     color: '#ffa500',
        //                 }}
        //                 type=""
        //                 onClick={() => {
        //                     navigate(`/admin/job/upsert?id=${entity._id}`)
        //                 }}
        //             />

        //             <Popconfirm
        //                 placement="leftTop"
        //                 title={"Xác nhận xóa result"}
        //                 description={"Bạn có chắc chắn muốn xóa result này ?"}
        //                 onConfirm={() => handleDeleteResult(entity._id)}
        //                 okText="Xác nhận"
        //                 cancelText="Hủy"
        //             >
        //                 <span style={{ cursor: "pointer", margin: "0 10px" }}>
        //                     <DeleteOutlined
        //                         style={{
        //                             fontSize: 20,
        //                             color: '#ff4d4f',
        //                         }}
        //                     />
        //                 </span>
        //             </Popconfirm>
        //         </Space>
        //     ),

        // },
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

        temp += "&populate=voteId&fields=voteId._id, voteId.question, voteId.status";
        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <DataTable<IResult>
                    actionRef={tableRef}
                    headerTitle="Danh sách Kết quả biểu quyết"
                    rowKey="_id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={results}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchResult({ query }))
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
            <ViewDetailResult
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div>
    )
}

export default ResultPage;