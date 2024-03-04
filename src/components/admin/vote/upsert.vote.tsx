import { Breadcrumb, Col, ConfigProvider, Divider, Form, Row, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import { FooterToolbar, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { useState, useEffect } from 'react';
import { callCreateVote, callFetchCompany, callFetchJob, callFetchVoteById, callUpdateVote } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { IVote } from "@/types/backend";

const ViewUpsertVote = (props: any) => {
    const [companies, setCompanies] = useState<any>([]);
    const [jobs, setJobs] = useState<any>([]);

    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // vote id
    const [dataUpdate, setDataUpdate] = useState<IVote | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            if (id) {
                const res = await callFetchVoteById(id);
                if (res && res.data) {
                    console.log(res.data)
                    setDataUpdate(res.data);
        
                    form.setFieldsValue({
                        ...res.data,
                        companyId: res.data.companyId as string,
                        jobId:res.data.jobId as string,

                    })
                }
            }
        }
        init();
        return () => form.resetFields()
    }, [id])

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<any> {
        const res = await callFetchCompany(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

     // Usage of DebounceSelect
    async function fetchJobList(name: string): Promise<any> {
        const res = await callFetchJob(`current=1&pageSize=100&name=/${name}/i`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: item._id as string
                }
            })
            return temp;
        } else return [];
    }

    const onFinish = async (values: any) => {
          console.log(values);
        if (dataUpdate?._id) {
            //update
            const vote = {
                question: values.question,
                status: values.status,
                companyId: values.companyId.key,
                jobId: values.jobId.key,
            }
             console.log(vote);

            const res = await callUpdateVote(values.status, dataUpdate._id);
            if (res.data) {
                message.success("Cập nhật vote thành công");
                navigate('/admin/vote')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
           
            //create
            const vote = {
                question: values.question,
                status: values.status,
                companyId: values.companyId.key,
                jobId: values.jobId.key,
            }
            console.log(vote);

            const res = await callCreateVote(vote);
            if (res.data) {
                message.success("Tạo mới vote thành công");
                navigate('/admin/vote')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }



    return (
        <div className={styles["upsert-job-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/vote">Manage Biểu quyết</Link>,
                        },
                        {
                            title: 'Upsert Biểu quyết',
                        },
                    ]}
                />
            </div>
            <div >

                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={
                            {
                                searchConfig: {
                                    resetText: "Hủy",
                                    submitText: <>{dataUpdate?._id ? "Cập nhật Biểu quyết" : "Tạo mới Biểu quyết"}</>
                                },
                                onReset: () => navigate('/admin/vote'),
                                render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />
                                },
                            }
                        }
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={6}>
                                <ProFormText
                                    label="Câu hỏi"
                                    name="question"
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                    ]}
                                    placeholder="Nhập tên Biểu quyết"
                                />
                            </Col>

                             {(dataUpdate?._id || !id) &&
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="jobId"
                                        label="Cuộc họp"
                                        rules={[{ required: true, message: 'Vui lòng chọn cuộc họp!' }]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={jobs}
                                            value={jobs}
                                            placeholder="Chọn cuộc họp"
                                            fetchOptions={fetchJobList}
                                            onChange={(newValue: any) => {
                                                if (newValue?.length === 0 || newValue?.length === 1) {
                                                    setJobs(newValue);
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>

                                </Col>
                            }


                            {(dataUpdate?._id || !id) &&
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="companyId"
                                        label="Công Ty"
                                        rules={[{ required: true, message: 'Vui lòng chọn đơn vị!' }]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={companies}
                                            value={companies}
                                            placeholder="Chọn đơn vị"
                                            fetchOptions={fetchCompanyList}
                                            onChange={(newValue: any) => {
                                                if (newValue?.length === 0 || newValue?.length === 1) {
                                                    setCompanies(newValue);
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>

                                </Col>
                            }
                            {/* <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="status"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col> */}
                        </Row>
                        
                        <Divider />
                    </ProForm>
                </ConfigProvider>

            </div>
        </div>
    )
}

export default ViewUpsertVote;