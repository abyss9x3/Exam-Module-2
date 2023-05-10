import React from 'react'
import { Button } from "@mui/material"
import { DoneAll, Send, HourglassTop, TaskAlt } from '@mui/icons-material';

import styles from './DeptSelectUI.module.css';

const DeptSelectUI = ({ loadingApproval, loadingSend, deptNames, showAppprovalBtns, handleApprovalClick, showSendBtn, sendBtnText, handleSendBtn, handleDeptBtnClick, deptStatus, approval }) => {

    return (
        <section className={styles.uiSection}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Select Department</h1>
                <div>
                    {deptNames && deptNames.map((deptName, id) =>
                        <div className={styles.btnContainer} key={id}>
                            <Button
                                variant="outlined"
                                sx={{ width: "8rem" }}
                                color={(deptStatus && deptStatus[deptName]) ? "success" : "secondary"}
                                endIcon={(deptStatus && deptStatus[deptName]) ? <DoneAll /> : null}
                                onClick={event => handleDeptBtnClick(event, deptName)}
                                disabled={!!(approval[deptName])}
                            >
                                {deptName}
                            </Button>
                            {showAppprovalBtns && showAppprovalBtns(deptName) ?
                                <Button
                                    variant="outlined"
                                    sx={{ marginLeft: "1.2rem", width: "9rem", }}
                                    color='info'
                                    endIcon={loadingApproval && loadingApproval(deptName) ? <HourglassTop /> : ((approval[deptName]) ? <TaskAlt /> : <Send />)}
                                    onClick={event => handleApprovalClick(event, deptName)}
                                    disabled={!!(approval[deptName])}
                                >
                                    {(approval[deptName]) ? "Approved" : "Approve"}
                                </Button>
                                : ""
                            }
                        </div>
                    )}
                </div>
            </div>

            {showSendBtn &&
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    {sendBtnText && <h1 style={{ padding: "1.5rem" }}>{sendBtnText}</h1>}
                    <Button
                        variant="contained"
                        sx={{ width: "9rem" }}
                        endIcon={loadingSend ? <HourglassTop /> : <Send />}
                        onClick={handleSendBtn}
                    >
                        Send
                    </Button>
                </div>
            }

        </section>
    )
}

export default DeptSelectUI;
