const {
  getApplications,
  createApplication,
  deleteApplication,
  updateApplication,
} = require('./applicationController');
const Application = require('../models/Application');

jest.mock('../models/Application');

describe('getApplications', () => {
  let page;
  let limit;
  let req;
  let res;
  beforeEach(() => {
    page = 1;
    limit = 5;
    req = {
      query: {
        page,
        limit,
        search: '',
        filter: 'income',
        comparison: 'gte',
      },
      user: 'userId1',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  it('get applications with filter name successfully', async () => {
    req.query = {
      ...req.query,
      search: 'searchField',
      filter: 'name',
    };

    const mockApplications = [
      { id: 1, name: 'testApplication1' },
      { id: 2, name: 'testApplication2' },
    ];
    Application.find.mockImplementation(() => {
      return {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValue(mockApplications),
      };
    });
    const totalCount = mockApplications.length;
    Application.countDocuments.mockResolvedValue(totalCount);

    await getApplications(req, res);

    expect(Application.find).toBeCalledWith({
      isDeleted: false,
      userId: 'userId1',
      name: { $regex: 'searchField', $options: 'i' },
    });
    expect(Application.countDocuments).toBeCalledWith({
      isDeleted: false,
      userId: 'userId1',
      name: { $regex: 'searchField', $options: 'i' },
    });
    expect(res.json).toBeCalledWith({
      applications: mockApplications,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  });
  it('get applications with filter income successfully', async () => {
    req.query = {
      ...req.query,
      search: '100',
      filter: 'income',
      comparison: 'gte',
    };
    const mockApplications = [
      { id: 1, name: 'testApplication1' },
      { id: 2, name: 'testApplication2' },
    ];
    Application.find.mockImplementation(() => {
      return {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValue(mockApplications),
      };
    });
    const totalCount = mockApplications.length;
    Application.countDocuments.mockResolvedValue(totalCount);

    await getApplications(req, res);

    expect(Application.find).toBeCalledWith({
      isDeleted: false,
      userId: 'userId1',
      income: { $gte: 100 },
    });
    expect(Application.countDocuments).toBeCalledWith({
      isDeleted: false,
      userId: 'userId1',
      income: { $gte: 100 },
    });
    expect(res.json).toBeCalledWith({
      applications: mockApplications,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  });
  it('get applications without search field', async () => {
    req.query = {
      ...req.query,
      search: '',
      filter: 'income',
      comparison: 'gte',
    };

    const mockApplications = [
      { id: 1, name: 'testApplication1' },
      { id: 2, name: 'testApplication2' },
    ];
    Application.find.mockImplementation(() => {
      return {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValue(mockApplications),
      };
    });
    const totalCount = mockApplications.length;
    Application.countDocuments.mockResolvedValue(totalCount);

    await getApplications(req, res);

    expect(Application.find).toBeCalledWith({
      isDeleted: false,
      userId: 'userId1',
    });
    expect(Application.countDocuments).toBeCalledWith({
      isDeleted: false,
      userId: 'userId1',
    });
    expect(res.json).toBeCalledWith({
      applications: mockApplications,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  });
  it('get applications with invalid search field', async () => {
    req.query = {
      ...req.query,
      search: 'a',
      filter: 'income',
      comparison: 'gte',
    };

    const mockApplications = [
      { id: 1, name: 'testApplication1' },
      { id: 2, name: 'testApplication2' },
    ];
    Application.find.mockImplementation(() => {
      return {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockReturnValue(mockApplications),
      };
    });
    const totalCount = mockApplications.length;
    Application.countDocuments.mockResolvedValue(totalCount);

    await getApplications(req, res);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      message: 'Invalid search value for numeric field.',
    });
  });
});
describe('createApplication', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: 'testApplicationName',
        description: 'testApplicationDescription',
        personalDetails: 'testApplicationDetail',
        income: 100,
        expenses: 200,
        assets: 300,
        liabilities: 400,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  it('create a new application successful', async () => {
    Application.prototype.save.mockResolvedValue(null);

    await createApplication(req, res);

    expect(res.status).toBeCalledWith(201);
    expect(res.json).toBeCalled();
  });

  it('saving error when create a new application', async () => {
    Application.prototype.save.mockRejectedValue(new Error('saving error'));

    await createApplication(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      message: 'Failed to create application',
      error: 'saving error',
    });
  });
});

describe('deleteApplication', () => {
  let req, res;
  beforeAll(() => {
    req = {
      params: {
        id: 'testApplicationId',
      },
      user: 'testUserId',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  it('delete an application successfully', async () => {
    const mockApplication = {
      id: 'testApplicationId',
      name: 'testApplicationName',
      userId: 'testUserId',
      save: jest.fn().mockResolvedValue(),
    };
    Application.findById.mockResolvedValue(mockApplication);

    await deleteApplication(req, res);

    expect(Application.findById).toHaveBeenCalledWith('testApplicationId');
    expect(mockApplication.isDeleted).toBe(true);
    expect(mockApplication.save).toBeCalled();
    expect(res.json).toBeCalledWith({ message: 'Application is deleted' });
  });

  it('cannot find the application', async () => {
    Application.findById.mockResolvedValue(null);

    await deleteApplication(req, res);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      message: 'Application not found or unauthorized to delete',
    });
  });

  it('saving error when deleting the application', async () => {
    const mockApplication = {
      id: 'testApplicationId',
      name: 'testApplicationName',
      userId: 'testUserId',
      save: jest.fn().mockRejectedValue(new Error('saving error')),
    };
    Application.findById.mockResolvedValue(mockApplication);

    await deleteApplication(req, res);

    expect(Application.findById).toHaveBeenCalledWith('testApplicationId');
    expect(mockApplication.isDeleted).toBe(true);
    expect(mockApplication.save).toBeCalled();
    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      error: 'saving error',
      message: 'Failed to delete application',
    });
  });
});

describe('updateApplication', () => {
  let req, res;
  beforeAll(() => {
    req = {
      body: {
        name: 'newApplicationName',
        description: 'newApplicationDescription',
        personalDetails: 'newApplicationDetails',
        income: 300,
        expenses: 300,
        assets: 300,
        liabilities: 300,
      },
      params: {
        id: 'testApplicationId',
      },
      user: 'testUserId',
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });
  it('update application successfully', async () => {
    const mockApplication = {
      id: 'testApplicationId',
      name: 'testApplicationName',
      userId: 'testUserId',
      save: jest.fn(),
    };
    Application.findById.mockResolvedValue(mockApplication);

    await updateApplication(req, res);

    expect(res.json).toBeCalledWith(mockApplication);
  });
  it('saving error when updating an application', async () => {
    const mockApplication = {
      id: 'testApplicationId',
      name: 'testApplicationName',
      userId: 'testUserId',
      save: jest.fn().mockRejectedValue(new Error('saving error')),
    };
    Application.findById.mockResolvedValue(mockApplication);

    await updateApplication(req, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      message: 'Failed to update application',
      error: 'saving error',
    });
  });
});
