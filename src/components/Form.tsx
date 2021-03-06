import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import * as H from 'history';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Header from './Header';
import { db } from '../firebase';
import GetValidationMessage from '../helpers/ValidationMessage';
import '../css/form.css';

type PropsType = {
  history: H.History,
  location: H.Location<SaveMailType>
}

type SaveMailType = {
  saveMailList: {
    id: number,
    name: string,
    portalCode: string,
    address: string,
    tel: string,
    mail: string,
    radioName: string,
    addressForRadio: string,
    age: string,
    program: string,
    corner: string,
    content: string,
    date: string,
    isUsedMyProgram: boolean
  }
}

type CornerListsType = {
  id: string,
  corner: string
}

type ProgramType = {
  id: string,
  program: string,
  name: string
}

type TemplateType = {
  id: string,
  name: string
}

const Form = (props: PropsType) => {
  const [name, setName] = useState<string>('');
  const [portalCode, setPortalCode] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [tel, setTel] = useState<string>('');
  const [radioName, setRadioName] = useState<string>('');
  const [addressForRadio, setAddressForRadio] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [program, setProgram] = useState<string>('');
  const [corner, setCorner] = useState<string>('');
  const [cornerLists, setCornerLists] = useState<CornerListsType[]>([{ id: '', corner: '' }]);
  const [content, setContent] = useState<string>('');
  const [nowFormInput, setNowFormInput] = useState<number>(1);
  const [programLists, setProgramLists] = useState<ProgramType[]>([{ id: '', program: '', name: '' }]);
  const [isUsedMyProgram, setisUsedMyProgram] = useState<boolean>(false);
  const [isCornerInput, setIsCornerInput] = useState<boolean>(false);
  const [myProgramList, setMyProgramList] = useState<ProgramType[]>([{ id: '', program: '', name: '' }]);
  const [template, setTemplate] = useState<string>('');
  const [isUsedtemplate, setIsUsedTemplate] = useState<boolean>(false);
  const [templateLists, setTemplateLists] = useState<TemplateType[]>([{ id: '', name: '' }]);
  const [validationMessage, setValidationMessage] = useState<string>('');

  const goToForm2 = () => {
    setNowFormInput(2);
  };
  const goToForm3 = () => {
    setNowFormInput(3);
  };
  const goBackForm1 = () => {
    setNowFormInput(1);
  };
  const goBackForm2 = () => {
    setNowFormInput(2);
  };

  // ????????????????????????
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      props.history.push('/login');
    }
  });

  useEffect(() => {
    // ????????????????????????????????????
    if (props.location.state) {
      const { saveMailList } = props.location.state;
      setName(saveMailList.name);
      setPortalCode(saveMailList.portalCode);
      setAddress(saveMailList.address);
      setTel(saveMailList.tel);
      setMail(saveMailList.mail);
      setRadioName(saveMailList.radioName);
      setAddressForRadio(saveMailList.addressForRadio);
      setAge(saveMailList.age);
      setProgram(saveMailList.program);
      setCorner(saveMailList.corner);
      setContent(saveMailList.content);
      if (saveMailList.isUsedMyProgram) {
        setMyProgramFromSaveMail(saveMailList.program);
      }
    }
    // ?????????????????????
    const unSub = db.collection('programList').onSnapshot((snapshot) => {
      setProgramLists(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          program: doc.data().program,
          name: doc.data().name,
        })),
      );
    });
    return () => unSub();
  }, []);

  // ??????????????????????????????
  useEffect(() => {
    const unSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (program !== '') {
          db.collection(`programs/${program}/corner`).onSnapshot((snapshot) => {
            setCornerLists(
              snapshot.docs.map((doc) => ({ id: doc.id, corner: doc.data().corner })),
            );
          });
        }
      }
    });
    return unSub();
  }, [program]);

  const setUserInfo = () => {
    const unSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection(`users/${user.uid}/info`).onSnapshot((snapshot) => {
          snapshot.docs.map((doc) => {
            setName(doc.data().name);
            setPortalCode(doc.data().portalCode);
            setAddress(doc.data().address);
            setTel(doc.data().tel);
            setRadioName(doc.data().radioName);
            setAddressForRadio(doc.data().addressForRadio);
            setAge(doc.data().age);
            setMail(doc.data().email);
          });
        });
      };
      unSub();
    });
  };

  const setMyProgram = () => {
    setisUsedMyProgram(true);
    const unSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection(`myProgram/${user.uid}/list`).onSnapshot((snapshot) => {
          setMyProgramList(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              program: doc.data().name,
              name: doc.data().name,
            })),
          );
        });
      };
      unSub();
    });
  };

  const setMyProgramFromSaveMail = (program: string) => {
    setisUsedMyProgram(true);
    const unSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection(`myProgram/${user.uid}/list`).where('name', '==', program).onSnapshot((snapshot) => {
          setMyProgramList(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              program: doc.data().name,
              name: doc.data().name,
            })),
          );
        });
      };
      unSub();
    });
  };

  const changeIsCornerInputStatus = () => {
    setIsCornerInput(!isCornerInput)
  }

  const setContentTemplate = () => {
    setIsUsedTemplate(true);
    const unSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection(`template/${user.uid}/data`).onSnapshot((snapshot) => {
          setTemplateLists(
            snapshot.docs.map((doc) => ({ id: doc.id, name: doc.data().name })),
          );
        });
      };
      unSub();
    });
  };

  const setTemplateContent = (templateName: string) => {
    const unSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection(`template/${user.uid}/data`).where('name', '==', templateName).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              setContent(doc.data().content);
            });
          });
      };
      unSub();
    });
  };

  const saveMail = () => {
    const unSub = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        db.collection(`mail/${user.uid}/saveMail`).add(({
          name,
          portalCode,
          address,
          tel,
          mail,
          radioName,
          addressForRadio,
          age,
          program,
          corner,
          content,
          isUsedMyProgram,
          // timestamp?????????????????????
          date: new Date(),
        }));
        props.history.push('/');
      };
      unSub();
    });
  };

  const submitMailInfo = () => {
    const regexp = /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/;
    if (mail === '' || regexp.test(mail) === false) {
      const validationInfo = GetValidationMessage('mail/invalid-email');
      setValidationMessage(validationInfo.message);
      return;
    }
    if (program === '') {
      const validationInfo = GetValidationMessage('mail/invalid-program');
      setValidationMessage(validationInfo.message);
      return;
    }
    if (corner === '') {
      const validationInfo = GetValidationMessage('mail/invalid-corner');
      setValidationMessage(validationInfo.message);
      return;
    }
    if (content === '') {
      const validationInfo = GetValidationMessage('mail/invalid-content');
      setValidationMessage(validationInfo.message);
      return;
    }
    props.history.push(
      {
        pathname: '/mail',
        state: {
          name,
          portalCode,
          address,
          tel,
          radioName,
          addressForRadio,
          age,
          mail,
          program,
          corner,
          content,
          isUsedMyProgram,
        },
      },
    );
  };

  return (
    <>
      <Header />
      <div className="bg_color" />
      <Container maxWidth="sm">
        <form className="form_wrap mb-30 pt-100">
          {(() => {
            if (nowFormInput === 1) {
              return (
                <div className="user_info">
                  <Box m={2}>
                    <p className="form_title text-center">????????????????????????</p>
                  </Box>
                  <Box my={4} mx={2}>
                    <TextField
                      id="name"
                      label="??????"
                      className="md_w-100 w_90"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </Box>
                  <Box my={4} mx={2}>
                    <TextField
                      id="portalCode"
                      label="????????????"
                      className="md_w-100 w_90"
                      value={portalCode}
                      onChange={(e) => {
                        setPortalCode(e.target.value);
                      }}
                    />
                  </Box>
                  <Box my={4} mx={2}>
                    <TextField
                      id="address"
                      label="??????"
                      className="md_w-100 w_90"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    />
                  </Box>
                  <Box my={4} mx={2}>
                    <TextField
                      id="tel"
                      label="????????????"
                      className="md_w-100 w_90"
                      value={tel}
                      onChange={(e) => {
                        setTel(e.target.value);
                      }}
                    />
                  </Box>
                  <Box m={6} className="text-center form_btn_wrap">
                    <Button variant="contained" className="btn set_info_btn" onClick={setUserInfo}>????????????????????????????????????</Button>
                  </Box>
                  <Box m={2} className="text-center form_btn_wrap">
                    <Button variant="contained" className="btn next_btn" onClick={goToForm2}><ArrowForwardIcon /></Button>
                  </Box>
                </div>
              );
            }
            if (nowFormInput === 2) {
              return (
                <div className="radio_info">
                  <Box m={2}>
                    <p className="form_title text-center">????????????</p>
                  </Box>
                  <Box my={4} mx={2}>
                    <p className="required">??????</p>
                    <TextField
                      id="mail"
                      required
                      label="?????????????????????"
                      className="md_w-100 w_90"
                      value={mail}
                      onChange={(e) => {
                        setMail(e.target.value);
                      }}
                    />
                  </Box>
                  <Box my={4} mx={2}>
                    <TextField
                      id="radioName"
                      label="??????????????????"
                      className="md_w-100 w_90"
                      value={radioName}
                      onChange={(e) => {
                        setRadioName(e.target.value);
                      }}
                    />
                  </Box>
                  <Box my={4} mx={2}>
                    <TextField
                      id="addressForRadio"
                      label="???????????????????????????"
                      className="md_w-100 w_90"
                      value={addressForRadio}
                      onChange={(e) => {
                        setAddressForRadio(e.target.value);
                      }}
                    />
                  </Box>
                  <Box my={4} mx={2}>
                    <TextField
                      id="age"
                      label="??????"
                      className="md_w-100 w_90"
                      value={age}
                      onChange={(e) => {
                        setAge(e.target.value);
                      }}
                    />
                  </Box>
                  {(() => {
                    if (isUsedMyProgram) {
                      return (
                        <Box my={4} mx={2}>
                          <p className="required">??????</p>
                          <InputLabel id="program">????????????</InputLabel>
                          <Select
                            labelId="program"
                            id="program"
                            required
                            className="selectbox md_w-100 w_90"
                            value={program}
                            onChange={(e: React.ChangeEvent<{ value: unknown}>) => {
                              setProgram(e.target.value as string);
                            }}
                          >
                            {myProgramList.map((myprogram) => (
                              <MenuItem
                                key={myprogram.id}
                                value={myprogram.name}
                              >
                                {myprogram.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      );
                    }
                    return (
                      <Box my={4} mx={2}>
                        <p className="required">??????</p>
                        <InputLabel id="program">??????</InputLabel>
                        <Select
                          labelId="program"
                          id="program"
                          required
                          className="selectbox md_w-100 w_90"
                          value={program}
                          onChange={(e: React.ChangeEvent<{ value: unknown}>) => {
                            setProgram(e.target.value as string);
                          }}
                        >
                          {programLists.map((programList) => (
                            <MenuItem
                              key={programList.id}
                              value={programList.program}
                            >
                              {programList.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    );
                  })()}
                  <Box m={6} className="text-center form_btn_wrap">
                    {(() => {
                      if (isUsedMyProgram) {
                        return (
                          <Button variant="contained" className="btn set_info_btn" onClick={() => { setisUsedMyProgram(false); }}>??????????????????????????????</Button>
                        );
                      }
                      return (
                        <Button variant="contained" className="btn set_info_btn" onClick={setMyProgram}>??????????????????????????????</Button>
                      );
                    })()}
                  </Box>
                  <Box m={2} className="text-center form_btn_wrap">
                    <Grid container justify="space-around">
                      <Grid item xs={3}>
                        <Button variant="contained" className="btn back_btn" onClick={goBackForm1}><ArrowBackIcon /></Button>
                      </Grid>
                      <Grid item xs={3}>
                        <Button variant="contained" className="btn next_btn" onClick={goToForm3}><ArrowForwardIcon /></Button>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              );
            }
            return (
              <div className="radio_info">
                <Box m={2}>
                  <p className="form_title text-center">????????????</p>
                </Box>
                {(() => {
                  if (isUsedMyProgram) {
                      return (
                        <Box my={4} mx={2}>
                          <p className="required">??????</p>
                          <TextField
                            id="corner"
                            required
                            label="????????????????????????"
                            className="md_w-100 w_90"
                            value={corner}
                            onChange={(e) => {
                              setCorner(e.target.value);
                            }}
                          />
                        </Box>
                      );
                  } else {
                    if (isCornerInput) {
                      return (
                        <Box my={4} mx={2}>
                          <p className="required">??????</p>
                          <TextField
                            id="corner"
                            required
                            label="????????????????????????"
                            className="md_w-100 w_90"
                            value={corner}
                            onChange={(e) => {
                              setCorner(e.target.value);
                            }}
                          />
                          <p className="change_corner_input_btn" onClick={changeIsCornerInputStatus}>???????????????????????????</p>
                        </Box>
                      );
                    } else {
                      return (
                        <Box my={4} mx={2}>
                          <p className="required">??????</p>
                          <InputLabel id="corner">????????????????????????</InputLabel>
                          <Select
                            labelId="corner"
                            id="corner"
                            required
                            className="selectbox md_w-100 w_90"
                            value={corner}
                            onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                              setCorner(e.target.value as string);
                            }}
                          >
                            {cornerLists.map((cornerList) => (
                              <MenuItem
                                key={cornerList.id}
                                value={cornerList.corner}
                              >
                                {cornerList.corner}
                              </MenuItem>
                            ))}
                          </Select>
                          <p className="change_corner_input_btn" onClick={changeIsCornerInputStatus}>???????????????????????????</p>
                        </Box>
                      );
                    }
                  }
                })()}
                {(() => {
                  if (isUsedtemplate) {
                    return (
                      <Box my={4} mx={2}>
                        <InputLabel id="template">??????????????????</InputLabel>
                        <Select
                          labelId="template"
                          id="template"
                          className="selectbox md_w-100 w_90"
                          value={template}
                          onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                            setTemplate(e.target.value as string);
                            setTemplateContent(e.target.value as string);
                          }}
                        >
                          {templateLists.map((templateList) => (
                            <MenuItem
                              key={templateList.id}
                              value={templateList.name}
                            >
                              {templateList.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    );
                  }
                  return '';
                })()}
                <Box my={4} mx={2}>
                  <p className="required">??????</p>
                  <TextField
                    id="content"
                    label="????????????"
                    className="textarea md_w-100 w_90"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                    }}
                  />
                </Box>
                <Box m={6} className="text-center form_btn_wrap">
                  <Button variant="contained" className="btn set_info_btn" onClick={submitMailInfo}>???????????????</Button>
                  <p className="error">{validationMessage}</p>
                </Box>
                <Box m={2} className="text-center form_btn_wrap">
                  <Grid container justify="space-between">
                    <Grid item>
                      <Button variant="contained" className="btn save_info_btn" onClick={saveMail}>????????????</Button>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" className="btn template_info_btn" onClick={setContentTemplate}>?????????????????????</Button>
                    </Grid>
                  </Grid>
                </Box>
                <Box m={2} className="text-center form_btn_wrap">
                  <Button variant="contained" className="btn back_btn" onClick={goBackForm2}><ArrowBackIcon /></Button>
                </Box>
              </div>
            );
          })()}
        </form>
      </Container>
    </>
  );
};

export default Form;
